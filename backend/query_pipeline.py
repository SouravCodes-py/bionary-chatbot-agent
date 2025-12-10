import os
import re
import sys
import textwrap
import google.generativeai as genai

# ────────────────────────────────────────────────
# IMPORT RETRIEVER
# ────────────────────────────────────────────────
try:
    import retriever as retriever_module
except ImportError:
    print("❌ retriever module not found")
    sys.exit(1)

# ────────────────────────────────────────────────
# GEMINI CONFIG (OPTIONAL FALLBACK)
# ────────────────────────────────────────────────
API_KEY = os.environ.get("GEMINI_API_KEY")

generation_model = None
if API_KEY:
    genai.configure(api_key=API_KEY)
    generation_model = genai.GenerativeModel(
        "gemini-2.5-flash-preview-09-2025"
    )

# ────────────────────────────────────────────────
# FORMATTERS
# ────────────────────────────────────────────────
def _format_event_list(rows, label):
    if not rows or rows[0][0] in {"No results", "Connection error"}:
        return f"No {label} found."

    output = []
    output.append(f"📌 {label.title()} ({len(rows)})\n")

    for idx, row in enumerate(rows, start=1):
        name = row[0]
        date = row[1]

        output.append(
            f"{idx}. {name}\n"
            f"   📅 {date}\n"
        )

    return "\n".join(output)

def _format_domain_list(rows, label):
    if not rows or rows[0][0] in {"No results", "Connection error"}:
        return f"No {label} found."

    output = [f"📌 {label.title()} ({len(rows)})\n"]

    for idx, r in enumerate(rows, start=1):
        output.append(
            f"{idx}. {r[0]}\n"
            f"   🏷 Domain: {r[1]}\n"
            f"   📅 Date: {r[2]}\n"
        )

    return "\n".join(output)

# ────────────────────────────────────────────────
# MAIN HANDLER
# ────────────────────────────────────────────────
def handle_user_query(user_question: str) -> str:
    q = user_question.lower().strip()

    # =====================================================
    # 1️⃣ LIST ALL EVENTS
    # =====================================================
    if (
        "event" in q
        and any(w in q for w in {"list", "show", "give", "all"})
        and not any(w in q for w in {"online", "offline", "hybrid"})
        and not re.search(r"(19|20)\d{2}", q)
    ):
        rows = retriever_module.query_relational_db(
            """
            SELECT name_of_event, date_of_event
            FROM events
            ORDER BY date_of_event
            """
        )
        return _format_event_list(rows, "all events")

    # =====================================================
    # 2️⃣ ONLINE / OFFLINE / HYBRID EVENTS
    # =====================================================
    for mode in ("online", "offline", "hybrid"):
        if mode in q and "event" in q:
            rows = retriever_module.query_relational_db(
                f"""
                SELECT name_of_event, date_of_event
                FROM events
                WHERE LOWER(mode_of_event) = '{mode}'
                ORDER BY date_of_event
                """
            )
            return _format_event_list(rows, f"{mode} events")

    # =====================================================
    # 3️⃣ EVENTS BY YEAR
    # =====================================================
    year_match = re.search(r"(19|20)\d{2}", q)
    if "event" in q and year_match:
        year = year_match.group()

        rows = retriever_module.query_relational_db(
            f"""
            SELECT name_of_event, date_of_event
            FROM events
            WHERE EXTRACT(YEAR FROM date_of_event) = {year}
            ORDER BY date_of_event
            """
        )
        return _format_event_list(rows, f"events in {year}")

    # =====================================================
    # 4️⃣ DOMAIN FILTER (AI / ML / Web / Cloud etc.)
    # =====================================================
    if "event" in q:
        domain_keywords = {
            "ai": "AI",
            "ml": "ML",
            "data": "DATA",
            "web": "WEB",
            "cloud": "CLOUD",
            "iot": "IOT",
            "blockchain": "BLOCKCHAIN",
            "cyber": "CYBER",
            "robotics": "ROBOTICS",
        }

        for key, label in domain_keywords.items():
            if key in q:
                rows = retriever_module.query_relational_db(
                    f"""
                    SELECT name_of_event, event_domain, date_of_event
                    FROM events
                    WHERE event_domain ILIKE '%{label}%'
                    ORDER BY date_of_event
                    """
                )
                return _format_domain_list(rows, f"{label} events")

    # =====================================================
    # 5️⃣ FALLBACK → SEMANTIC SEARCH
    # =====================================================
    if generation_model is None:
        return "I do not have that information."

    try:
        results = retriever_module.query_vector_db(user_question)
    except Exception as e:
        return f"Error querying database: {e}"

    if results and results[0] not in {"No matches", "Connection error"}:
        return "\n\n".join(results)

    return "I do not have that information."

# ────────────────────────────────────────────────
# CLI TEST
# ────────────────────────────────────────────────
if __name__ == "__main__":
    print("✅ Club Knowledge Agent Ready")
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() in {"exit", "quit"}:
            break
        print("\nAgent:\n", handle_user_query(user_input))
