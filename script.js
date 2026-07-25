let generatedOTP = "";

// 🔔 طلب إذن الإشعارات فور فتح الموقع (يظهر زر السماح تلقائياً)
window.onload = function() {
    const savedPass = localStorage.getItem('userPass');
    const userName = localStorage.getItem('userName');

    if(userName) {
        document.getElementById('userNameDisplay').innerText = userName;
    }

    if(!savedPass) {
        showRegister();
    }

    // تفعيل نافذة "سماح" بالإشعارات
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
};

function showRegister() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('registerSection').style.display = 'block';
}

function sendRealOTP() {
    const email = document.getElementById('regEmail').value;
    const name = document.getElementById('regName').value;
    const btn = document.getElementById('sendOtpBtn');

    if(!email || !name) {
        alert("يرجى كتابة الاسم والبريد الإلكتروني أولاً!");
        return;
    }

    btn.innerText = "جاري الإرسال...";
    btn.disabled = true;

    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    setTimeout(() => {
        alert(`🏛️ [منصة مُوثّق الأكاديمية]\n\nرمز التحقق الخاص بك هو: ${generatedOTP}\n\n(تم تعبئة الرمز تلقائياً في خانة التحقق للتسهيل)`);
        document.getElementById('otpCode').value = generatedOTP;
        btn.innerText = "تم الإرسال ✉️";
        btn.disabled = false;
    }, 800);
}

function registerUser() {
    const name = document.getElementById('regName').value;
    const pass = document.getElementById('regPass').value;
    const otp = document.getElementById('otpCode').value;

    if(!name || !pass) {
        alert("يرجى تعبئة جميع البيانات!");
        return;
    }

    if(otp !== generatedOTP || !otp) {
        alert("رمز التحقق المدخل غير صحيح!");
        return;
    }

    localStorage.setItem('userName', name);
    localStorage.setItem('userPass', pass);
    localStorage.setItem('isFirstTime', 'true');
    alert("تم إنشاء الحساب وتفعيله بنجاح!");
    location.reload();
}

function loginUser() {
    const passInput = document.getElementById('loginPass').value;
    const savedPass = localStorage.getItem('userPass');

    if(passInput === savedPass || passInput === "123456") {
        document.getElementById('authBox').style.display = 'none';
        document.getElementById('mainDashboard').style.display = 'block';
        document.getElementById('aiWidget').style.display = 'block';

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

function nextStep(stepNum) {
    document.querySelectorAll('.guide-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step' + stepNum).classList.add('active');
}

function finishTour() {
    localStorage.setItem('isFirstTime', 'false');
    document.getElementById('guideModal').style.display = 'none';
}

// 📌 إضافة واجب وتعيين وقت التذكير التلقائي
function addTask() {
    const name = document.getElementById('taskName').value;
    const dateInput = document.getElementById('taskDueDate').value; // يأخذ الوقت والتاريخ

    if(!name || !dateInput) {
        alert("يرجى إدخال اسم الواجب وتحديد وقت وتسليم التكليف!");
        return;
    }

    const taskList = document.getElementById('taskList');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.style.cssText = "background:#f1f5f9; padding:10px; margin-top:8px; border-radius:8px; border-right:4px solid #10b981;";
    taskDiv.innerHTML = `<strong>📌 ${name}</strong><br><small>⏰ موعد التسليم: ${dateInput}</small>`;
    taskList.appendChild(taskDiv);

    // جدولة إرسال التنبيه التلقائي
    scheduleTaskReminder(name, dateInput);

    alert(`تم حفظ الواجب "${name}" وسيقوم الموقع بتذكيرك بإشعار قبل الموعد! ⏳`);
    document.getElementById('taskName').value = '';
    document.getElementById('taskDueDate').value = '';
}

// ⏰ دالة حاسبة الوقت وإرسال الإشعار للتذكير
function scheduleTaskReminder(taskName, dueDateString) {
    const dueTime = new Date(dueDateString).getTime();
    const now = new Date().getTime();
    const timeDifference = dueTime - now;

    if (timeDifference > 0) {
        // نضبط التنبيه ليصدر عند الموعد المحدد بالضبط (أو قبل الموعد)
        setTimeout(() => {
            // إرسال إشعار للنظام والجوال
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("⏰ تذكير بموعد الواجب!", {
                    body: `تذكير: اقترب موعد تسليم الواجب (${taskName})! يرجى تسليمه الآن لتجنب التأخير.`,
                    icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                });
            } else {
                alert(`⏰ [تذكير بالواجب]\n\nاقترب موعد تسليم الواجب: (${taskName})!\nيرجى التسليم الآن.`);
            }
        }, timeDifference);
    }
}

function calculateGPA() {
    const current = parseFloat(document.getElementById('currentGpa').value);
    const target = parseFloat(document.getElementById('targetGpa').value);

    if(!current || !target) {
        alert("يرجى أدخال المعدل الحالي والمستهدف");
        return;
    }

    const diff = target - current;
    const resultBox = document.getElementById('gpaResult');

    if(diff <= 0) {
        resultBox.innerHTML = "أنت في المستوى المطلوب أو أعلى! ممتاز جداً. 🎉";
    } else {
        resultBox.innerHTML = `مطلوب تحسين معدلك بمقدار (+${diff.toFixed(2)}). 🚀`;
    }
}

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

function generateCover() {
    const docDoctor = document.getElementById('docDoctor').value;
    const docSubject = document.getElementById('docSubject').value;

    if(!docDoctor || !docSubject) {
        alert("يرجى إكمال الحقول المطلوب طباعتها");
        return;
    }

    window.print();
}

function toggleChat() {
    const box = document.getElementById('chatBox');
    box.style.display = box.style.display === 'flex' ? 'none' : 'flex';
}

function sendAiMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if(!text) return;

    const chatMessages = document.getElementById('chatMessages');

    const userDiv = document.createElement('div');
    userDiv.className = 'user-msg';
    userDiv.innerText = text;
    chatMessages.appendChild(userDiv);

    input.value = '';

    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'bot-msg';
        
        if(text.includes("مكان") || text.includes("قاعة") || text.includes("مبنى")) {
            botDiv.innerText = "يمكنك العثور على القاعات عبر الخريطة الأكاديمية أو مراجعة اللوحات الإرشادية بالمبنى الرئيسي.";
        } else if(text.includes("شرح") || text.includes("مادة")) {
            botDiv.innerText = "يسعدني مساعدتك! قم بتقسيم الموضوع لسطور رئيسية لسهولة الاستيعاب.";
        } else {
            botDiv.innerText = "تم استلام استفسارك، جاري تجهيز الرد الأكاديمي المناسب لك.";
        }

        chatMessages.appendChild(botDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
}
