// Tema değiştirme fonksiyonu
function toggleTheme() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Sayfa yüklendiğinde tema tercihini kontrol et
document.addEventListener('DOMContentLoaded', () => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('darkMode');

    // Kullanıcının önceki tercihini veya sistem tercihini uygula
    if (storedTheme !== null) {
        if (storedTheme === 'true') {
            document.body.classList.add('dark-mode');
        }
    } else if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-mode');
    }

    // Tema değiştirme butonuna tıklama olayı ekle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);

    // Sistem teması değiştiğinde güncelle
    prefersDarkScheme.addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
}); 