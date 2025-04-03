// 技能条动画
document.querySelectorAll('.skill').forEach(skill => {
    const level = skill.getAttribute('data-level');
    skill.style.setProperty('--width', `${level}%`);
});

// 表单提交（可扩展为Python后端API调用）
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // 此处可添加Fetch API调用Python后端（Flask示例见下文）
    alert('表单已提交！');
});

// 滚动动画
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});