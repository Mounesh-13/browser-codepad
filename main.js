// DOM Elements
const htmlEditor = document.getElementById('htmlEditor');
const cssEditor = document.getElementById('cssEditor');
const jsEditor = document.getElementById('jsEditor');
const preview = document.getElementById('preview');
const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const editorPanes = document.querySelectorAll('.editor-pane');

// Default code for demonstration
const defaultHTML = '<!-- Write your HTML here -->\n<h2>Hello, World!</h2>';
const defaultCSS = '/* Write your CSS here */\nbody {\n    font-family: Roboto, Arial, sans-serif;\n    color: #23272f;\n    background: #f4f6fa;\n    padding: 32px;\n}';
const defaultJS = '// Write your JavaScript here\nconsole.log("Hello from JS!");';

function updatePreview() {
    const html = htmlEditor.value;
    const css = `<style>${cssEditor.value}</style>`;
    const js = `<script>\n${jsEditor.value}\n<\/script>`;
    const srcdoc = `<!DOCTYPE html><html><head><meta charset=\"UTF-8\">${css}</head><body>${html}${js}</body></html>`;
    // Always get the latest iframe reference
    const currentPreview = document.getElementById('preview');
    if (!currentPreview || !currentPreview.parentNode) return;
    const parent = currentPreview.parentNode;
    const newIframe = currentPreview.cloneNode(false);
    newIframe.id = currentPreview.id;
    newIframe.srcdoc = srcdoc;
    parent.replaceChild(newIframe, currentPreview);
}

// Tab switching
for (const btn of tabBtns) {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        editorPanes.forEach(p => p.classList.remove('active'));
        const tab = btn.getAttribute('data-tab');
        btn.classList.add('active');
        if (tab === 'html') htmlEditor.classList.add('active');
        if (tab === 'css') cssEditor.classList.add('active');
        if (tab === 'js') jsEditor.classList.add('active');
    });
}

// Live update preview as user types (debounced)
let debounceTimer;
function debounceUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updatePreview, 250);
}
[htmlEditor, cssEditor, jsEditor].forEach(editor => {
    editor.addEventListener('input', debounceUpdate);
});

// Run button updates preview immediately
runBtn.addEventListener('click', updatePreview);

// Clear button resets editors and preview
clearBtn.addEventListener('click', () => {
    htmlEditor.value = '';
    cssEditor.value = '';
    jsEditor.value = '';
    updatePreview();
});

// Set default code on load
window.addEventListener('DOMContentLoaded', () => {
    htmlEditor.value = defaultHTML;
    cssEditor.value = defaultCSS;
    jsEditor.value = defaultJS;
    updatePreview();
});

// Tab key inserts 4 spaces in textarea
function handleTab(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
    }
}
[htmlEditor, cssEditor, jsEditor].forEach(editor => {
    editor.addEventListener('keydown', handleTab);
});
