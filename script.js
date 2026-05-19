const NOTES_KEY = 'minhaNota';
const THEME_KEY = 'temaPreferencia';
const SAVE_DELAY_MS = 250;

function supportsLocalStorage() {
    try {
        const testKey = '__teste_localstorage__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

function getSavedNote() {
    try {
        return window.localStorage.getItem(NOTES_KEY) ?? '';
    } catch {
        return '';
    }
}

function saveNote(note) {
    try {
        window.localStorage.setItem(NOTES_KEY, note);
        return true;
    } catch {
        return false;
    }
}

function getSavedTheme() {
    try {
        return window.localStorage.getItem(THEME_KEY);
    } catch {
        return null;
    }
}

function saveTheme(theme) {
    try {
        window.localStorage.setItem(THEME_KEY, theme);
        return true;
    } catch {
        return false;
    }
}

function resolveTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
        return theme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateThemeButton(currentTheme) {
    const themeButton = document.getElementById('alternarTema');
    if (!themeButton) {
        return;
    }

    themeButton.textContent = currentTheme === 'dark'
        ? 'Ativar modo claro'
        : 'Ativar modo escuro';
}

function applyTheme(themePreference) {
    const resolvedTheme = resolveTheme(themePreference);
    document.body.classList.toggle('dark-mode', resolvedTheme === 'dark');
    updateThemeButton(resolvedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    saveTheme(nextTheme);
}

function debounce(callback, delay) {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = window.setTimeout(() => callback(...args), delay);
    };
}

function updateStatus(message, variant = 'info') {
    const statusElement = document.getElementById('status');
    if (!statusElement) {
        return;
    }

    statusElement.textContent = message;
    statusElement.dataset.variant = variant;
}

function handleNoteInput(event) {
    const note = event.target.value;
    const saved = saveNote(note);
    updateStatus(saved ? 'Salvo automaticamente.' : 'Erro ao salvar. Verifique o armazenamento.');
}

function clearNote() {
    const textarea = document.getElementById('blocoDeNotas');
    if (!textarea) {
        return;
    }

    textarea.value = '';
    const saved = saveNote('');
    updateStatus(saved ? 'Nota limpa e salva.' : 'Erro ao limpar a nota.');
    textarea.focus();
}

function initNoteApp() {
    const textarea = document.getElementById('blocoDeNotas');
    const clearButton = document.getElementById('limparNota');

    if (!textarea || !clearButton) {
        return;
    }

    if (!supportsLocalStorage()) {
        updateStatus('localStorage não está disponível. Sua nota não será salva.', 'warning');
        return;
    }

    const themeButton = document.getElementById('alternarTema');
    const savedTheme = getSavedTheme();

    if (!textarea || !clearButton || !themeButton) {
        return;
    }

    if (!supportsLocalStorage()) {
        applyTheme('light');
        updateStatus('localStorage não está disponível. Sua nota não será salva.', 'warning');
        return;
    }

    textarea.value = getSavedNote();
    textarea.addEventListener('input', debounce(handleNoteInput, SAVE_DELAY_MS));
    clearButton.addEventListener('click', clearNote);
    themeButton.addEventListener('click', toggleTheme);
    applyTheme(savedTheme || 'auto');
    updateStatus('Pronto para anotar.');
}

document.addEventListener('DOMContentLoaded', initNoteApp);
