import re

BAD_WORDS = [
    "เหี้ย", "สัส", "สัด", "เย็ด", "ควย", "แตด", "หี", "จิ๋ม", "จู๋",
    "หน้าหี", "สันดาน", "จัญไร", "ระยำ", "เสือก", "พ่อตาย", "แม่ตาย",
    "fuck", "shit", "bitch", "cunt", "dick", "pussy", "asshole", "slut", "whore",
    "สึส", "เชี่ย", "สัสๆ", "ควัย", "ฆวย"
]

def contains_profanity(text: str) -> bool:
    if not text:
        return False
        
    text_lower = text.lower()
    text_clean = re.sub(r'[\s\.\-_]+', '', text_lower)

    for word in BAD_WORDS:
        word_clean = word.lower()
        if re.search(r'[a-z]', word_clean):
            pattern = r'\b' + re.escape(word_clean) + r'\b'
            if re.search(pattern, text_lower):
                return True
        else:
            word_clean_no_spaces = re.sub(r'[\s\.\-_]+', '', word_clean)
            if word_clean in text_lower or (word_clean_no_spaces and word_clean_no_spaces in text_clean):
                return True
    return False