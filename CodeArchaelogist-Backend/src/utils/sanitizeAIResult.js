const BLOCKED_KEYS = new Set([
    "code",
    "source",
    "sourceCode",
    "source_code",
    "content",
    "fileContent",
    "file_content",
    "snippet",
    "codeSnippet",
    "code_snippet",
    "diff",
    "patch",
    "rawCode",
    "raw_code",
]);

function sanitizeValue(value) {
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (
        value &&
        typeof value === "object" &&
        !(value instanceof Date)
    ) {
        const cleaned = {};

        for (const [key, childValue] of Object.entries(value)) {
            if (BLOCKED_KEYS.has(key)) {
                continue;
            }

            cleaned[key] = sanitizeValue(childValue);
        }

        return cleaned;
    }

    return value;
}

export function sanitizeAIResult(result) {
    return sanitizeValue(result);
}