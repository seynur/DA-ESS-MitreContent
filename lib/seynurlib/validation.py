import os
import re

def is_alphanumeric(input_string, exact_length=0):
    """Return True if input is a valid alphanumeric, False otherwise

    Keyword arguments:
    input_string -- string value to check
    exact_length -- strict string length check, if 0, it's omitted (default 0)
    """
    if exact_length > 0 and len(input_string)!=exact_length:
        return False

    # search for any non-alphanumeric in string
    pattern=re.compile("[^a-zA-Z0-9_]+")

    # if we find a non-alphanumeric char, return false
    if re.search(pattern, input_string):
        return False

    return True
