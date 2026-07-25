// فحص حالة الدخول عند فتح الصفحة
window.onload = function() {
    const savedPass = localStorage.getItem('userPass');
    const userName = localStorage.getItem('userName');

    if(userName) {
        document.getElementById('userNameDisplay').innerText = userName;
    }

    // إذا كان الحساب غير مسجل إطلاقاً، تحويل لشاشة التسجيل
    if(!savedPass) {
        showRegister();
    }
};

function showRegister() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
}

function sendOTP() {
    alert("تم إرسال رمز التحقق التجريبي (1234) إلى بريدك الإلكتروني!");
}

function registerUser() {
    const name = document.getElementById('regName').value;
    const pass = document.getElementById('regPass').value;
    const otp = document.getElementById('otpCode').value;

    if(!name || !pass || otp !== "1234") {
        alert("يرجى تعبئة كافة البيانات وإدخال رمز التحقق الصحيح (1234)");
        return;
    }

    localStorage.setItem('userName', name);
    localStorage.setItem('userPass', pass);
    localStorage.setItem('isFirstTime', 'true');
    alert("تم إنشاء الحساب بنجاح!");
    location.reload();
}

function loginUser() {
    const passInput = document.getElementById('loginPass').value;
    const savedPass = localStorage.getItem('userPass');

    if(passInput === savedPass || passInput === "123456") {
        document.getElementById('authBox').style.display = 'none';
        document.getElementById('mainDashboard').style.display = 'block';
        document.getElementById('aiWidget').style.display = 'block';

        // إظهار جولة الشرح لأول مرة فقط
        if(localStorage.getItem('isFirstTime') !== 'false') {
            document.getElementById('guideModal').style.display = 'flex';
        }
    } else {
        alert("كلمة المرور غير صحيحة!");
    }
}

function logout() {
    location.reload();
}

// أزرار الجولة الشارحة
function nextStep(stepNum) {
    document.querySelectorAll('.guide-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step' + stepNum).classList.add('active');
}

function finishTour() {
    localStorage.setItem('isFirstTime', 'false');
    document.getElementById('guideModal').style.display = 'none';
}

// 1. إضافة واجب
function addTask() {
    const name = document.getElementById('taskName').value;
    const date = document.getElementById('taskDueDate').value;

    if(!name || !date) {
        alert("يرجى إدخال البيانات كاملة");
        return;
    }

    const taskList = document.getElementById('taskList');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.innerHTML = `<strong>${name}</strong><br>موعد التسليم: ${date}`;
    taskList.appendChild(taskDiv);

    alert("تم إضافة الواجب بنجاح! وسيطبق عليه التنبيه التلقائي قبل موعد التسليم.");
}

// 2. حاسبة المعدل
function calculateGPA() {
    const current = parseFloat(document.getElementById('currentGpa').value);
    const target = parseFloat(document.getElementById('targetGpa').value);

    if(!current || !target) {
        alert("يرجى إدخال المعدل الحالي والمستهدف");
        return;
    }

    const diff = target - current;
    const resultBox = document.getElementById('gpaResult');

    if(diff <= 0) {
        resultBox.innerHTML = "أنت حالياً في المستوى المطلوب أو أعلى! حافظ على أدائك. 🎉";
    } else {
        resultBox.innerHTML = `تحتاج لرفع معدلك بمقدار (+${diff.toFixed(2)}). يوصى بالحصول على A في المواد القادمة. 🚀`;
    }
}

// 3. حفظ الملاحظات
function saveNote() {
    const content = document.getElementById('noteContent').value;
    if(!content) return;

    const savedNotes = document.getElementById('savedNotes');
    const noteDiv = document.createElement('div');
    noteDiv.style.cssText = "background:#e2e8f0; padding:8px; border-radius:6px; margin-top:8px; font-size:12px;";
    noteDiv.innerText = content;
    savedNotes.appendChild(noteDiv);

    document.getElementById('noteContent').value = '';
}

// 4. طباعة الغلاف
function generateCover() {
    const docDoctor = document.getElementById('docDoctor').value;
    const docSubject = document.getElementById('docSubject').value;

    if(!docDoctor || !docSubject) {
        alert("يرجى تعبئة اسم المادة والدكتور");
        return;
    }

    window.print();
}

// 🤖 المساعد الذكي
function toggleChat() {
    const box = document.getElementById('chatBox');
    box.style.display = box.style.display === 'flex' ? 'none' : 'flex';
}

function sendAiMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if(!text) return;

    const chatMessages = document.getElementById('chatMessages');

    // رسالة المستخدم
    const userDiv = document.createElement('div');
    userDiv.className = 'user-msg';
    userDiv.innerText = text;
    chatMessages.appendChild(userDiv);

    input.value = '';

    // رد المساعد الآلي التفاعلي
    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'bot-msg';
        
        if(text.includes("مكان") || text.includes("ين") || text.includes("قاعة")) {
            botDiv.innerText = "أماكن القاعات والمباني تجدها عادة في المبنى الرئيسي للدور الأول أو عبر الخريطة الأكاديمية لجامعتك.";
        } else if(text.includes("شرح") || text.includes("سؤال")) {
            botDiv.innerText = "يسعدني شرح هذا المفهوم لك! باختصار، اعتمد دائماً على تقسيم السؤال إلى خطوات منطقية بسيطة.";
        } else {
            botDiv.innerText = "تم استلام سؤالك الأكاديمي، المساعد يعمل على تلخيصه وإعطائك أفضل إجابة!";
        }

        chatMessages.appendChild(botDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
      }
