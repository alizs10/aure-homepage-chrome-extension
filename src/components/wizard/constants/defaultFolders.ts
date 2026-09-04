export interface DefaultWebsite {
    title: string;
    url: string;
}

export interface DefaultFolder {
    title: string;
    websites: DefaultWebsite[];
}

export const DEFAULT_FOLDERS: DefaultFolder[] = [
    {
        title: "AI",
        websites: [
            { title: "ChatGPT", url: "https://chatgpt.com" },
            { title: "Gemini", url: "https://gemini.google.com" },
            { title: "Claude", url: "https://claude.ai" },
            { title: "DeepSeek", url: "https://chat.deepseek.com" },
            { title: "Grok", url: "https://grok.com" },
            { title: "GitHub Copilot", url: "https://github.com/features/copilot" },
            { title: "Microsoft Copilot", url: "https://copilot.microsoft.com" },
            { title: "Perplexity", url: "https://www.perplexity.ai" },
            { title: "NotebookLM", url: "https://notebooklm.google.com" },
            { title: "Character.AI", url: "https://character.ai" },
            { title: "Qwen", url: "https://chat.qwen.com" },
            { title: "Poe", url: "https://poe.com" },
            { title: "Hugging Face", url: "https://huggingface.co" },
            { title: "Midjourney", url: "https://www.midjourney.com" },
            { title: "Suno", url: "https://suno.com" },
            { title: "ElevenLabs", url: "https://elevenlabs.io" },
        ],
    },

    {
        title: "Google",
        websites: [
            { title: "Google", url: "https://www.google.com" },
            { title: "YouTube", url: "https://www.youtube.com" },
            { title: "Gmail", url: "https://mail.google.com" },
            { title: "Drive", url: "https://drive.google.com" },
            { title: "Maps", url: "https://maps.google.com" },
            { title: "Photos", url: "https://photos.google.com" },
            { title: "Calendar", url: "https://calendar.google.com" },
            { title: "Docs", url: "https://docs.google.com" },
            { title: "Sheets", url: "https://sheets.google.com" },
            { title: "Translate", url: "https://translate.google.com" },
            { title: "Meet", url: "https://meet.google.com" },
            { title: "Keep", url: "https://keep.google.com" },
            { title: "Slides", url: "https://slides.google.com" },
            { title: "News", url: "https://news.google.com" },
            { title: "Play Store", url: "https://play.google.com" },
            { title: "Google Chat", url: "https://chat.google.com" },
            { title: "Google Cloud", url: "https://console.cloud.google.com" },
            { title: "Google Analytics", url: "https://analytics.google.com" },
            { title: "Search Console", url: "https://search.google.com/search-console" },
            { title: "Google Ads", url: "https://ads.google.com" },
        ],
    },
];