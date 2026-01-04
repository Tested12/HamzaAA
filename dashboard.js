// ===== Dashboard JavaScript =====

// Check if user is logged in and manage sections based on user type
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser && !window.location.href.includes('index.html')) {
        // If not logged in and not on login page, stay on dashboard for demo
        console.log('Demo mode - no login required');
        // Default to buyer view for demo
        showSectionsByUserType('buyer');
        return;
    }
    
    // Update user name and show/hide sections based on user type
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const userNameEl = document.querySelector('.user-name');
        if (userNameEl && user.name) {
            userNameEl.textContent = user.name;
        }
        
        // Get user type (default to 'buyer' if not set for backward compatibility)
        const userType = user.userType || 'buyer';
        showSectionsByUserType(userType);
        updateNavigationByUserType(userType);
    } else {
        // Default view
        showSectionsByUserType('buyer');
    }
});

// Function to show/hide sections based on user type
function showSectionsByUserType(userType) {
    const searchSection = document.getElementById('search-section');
    const addPropertySection = document.getElementById('add-property-section');
    const pendingSection = document.getElementById('pending-properties-section');
    const savedPropertiesCard = document.querySelector('.search-saved-card'); // العقارات المحفوظة في قسم البحث
    
    // Hide all sections first
    if (searchSection) searchSection.style.display = 'none';
    if (addPropertySection) addPropertySection.style.display = 'none';
    if (pendingSection) pendingSection.style.display = 'none';
    
    switch(userType) {
        case 'buyer':
            // مشتري/مستأجر: يرى البحث + العقارات المحفوظة فقط (لا يرى الموافقات)
            if (searchSection) searchSection.style.display = 'block';
            if (savedPropertiesCard) savedPropertiesCard.style.display = 'block';
            // إخفاء قسم الموافقات للمشترين
            if (pendingSection) pendingSection.style.display = 'none';
            break;
            
        case 'owner':
            // مالك: يرى إضافة عقار فقط
            if (addPropertySection) addPropertySection.style.display = 'block';
            break;
            
        case 'agent':
            // وسيط: يرى قسم الموافقات + إضافة عقار (مثل البائع)
            const pendingSectionAgent = document.getElementById('pending-properties-section');
            if (pendingSectionAgent) pendingSectionAgent.style.display = 'block';
            if (searchSection) searchSection.style.display = 'none'; // إخفاء قسم البحث عن الوسيط
            if (addPropertySection) addPropertySection.style.display = 'block'; // الوسيط يمكنه إضافة عقارات
            // تحميل البوستات المعلقة وتحديث الرصيد
            loadPendingProperties();
            updateAgentBalance();
            break;
            
        default:
            // Default to buyer view
            if (searchSection) searchSection.style.display = 'block';
            if (savedPropertiesCard) savedPropertiesCard.style.display = 'block';
    }
}

// Function to update navigation links based on user type
function updateNavigationByUserType(userType) {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        switch(userType) {
            case 'buyer':
                // مشتري: يرى فقط رابط البحث
                if (href === '#search-section') {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
                break;
                
            case 'owner':
                // مالك: يرى فقط رابط إضافة عقار
                if (href === '#add-property-section') {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
                break;
                
            case 'agent':
                // وسيط: يرى الموافقات + إضافة عقار
                if (href === '#pending-properties-section' || href === '#add-property-section') {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
                break;
                
            default:
                // Default to buyer
                if (href === '#search-section') {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
        }
    });
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    showNotification('تم تسجيل الخروج بنجاح 👋', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ===== Filter Tags Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Allow multiple selection or single selection
            this.classList.toggle('active');
        });
    });
});

// ===== Room Buttons Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const roomBtns = document.querySelectorAll('.room-btn');
    roomBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            roomBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ===== Property Type Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const typeBtns = document.querySelectorAll('.type-btn');
    typeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            typeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ===== Sale/Rent Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ===== Favorite Button Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const favBtns = document.querySelectorAll('.favorite-btn');
    favBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('تمت إضافة العقار للمحفوظات ❤️', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('تمت إزالة العقار من المحفوظات', 'success');
            }
        });
    });
});

// ===== Remove Saved Property =====
document.addEventListener('DOMContentLoaded', () => {
    const removeBtns = document.querySelectorAll('.remove-saved');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.saved-property-item');
            item.style.transform = 'translateX(100%)';
            item.style.opacity = '0';
            setTimeout(() => {
                item.remove();
                showNotification('تمت إزالة العقار من المحفوظات', 'success');
            }, 300);
        });
    });
});

// ===== Search Button =====
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري البحث...';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-search"></i> بحث';
                showNotification('تم العثور على 2 عقارات مطابقة 🏠', 'success');
            }, 1500);
        });
    }
});

// ===== Booking Form Submit =====
document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحجز...';
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> تأكيد الحجز';
                showNotification('تم حجز موعد المعاينة بنجاح! سنتواصل معك قريباً 📅', 'success');
                this.reset();
            }, 1500);
        });
    }
});

// ===== Publish Property =====
document.addEventListener('DOMContentLoaded', () => {
    const publishBtns = document.querySelectorAll('.step-card .btn-primary.btn-full');
    publishBtns.forEach(btn => {
        if (btn.textContent.includes('نشر العقار')) {
            btn.addEventListener('click', function() {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري النشر...';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-paper-plane"></i> نشر العقار';
                    showNotification('تم نشر العقار بنجاح! سيتم مراجعته قريباً 🎉', 'success');
                }, 2000);
            });
        }
    });
});

// ===== Send Message =====
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (sendBtn && chatInput && chatMessages) {
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                const msgEl = document.createElement('div');
                msgEl.className = 'message received';
                msgEl.innerHTML = `<p>${message}</p>`;
                msgEl.style.opacity = '0';
                msgEl.style.transform = 'translateY(10px)';
                chatMessages.appendChild(msgEl);
                
                setTimeout(() => {
                    msgEl.style.transition = 'all 0.3s ease';
                    msgEl.style.opacity = '1';
                    msgEl.style.transform = 'translateY(0)';
                }, 10);
                
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Auto reply after 1.5 seconds
                setTimeout(() => {
                    const replyEl = document.createElement('div');
                    replyEl.className = 'message sent';
                    replyEl.innerHTML = `<p>شكراً لتواصلك معنا! سنرد عليك في أقرب وقت 😊</p>`;
                    replyEl.style.opacity = '0';
                    replyEl.style.transform = 'translateY(10px)';
                    chatMessages.appendChild(replyEl);
                    
                    setTimeout(() => {
                        replyEl.style.transition = 'all 0.3s ease';
                        replyEl.style.opacity = '1';
                        replyEl.style.transform = 'translateY(0)';
                    }, 10);
                    
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1500);
            }
        };
        
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// ===== Map Button =====
document.addEventListener('DOMContentLoaded', () => {
    const mapBtn = document.querySelector('.map-btn');
    if (mapBtn) {
        mapBtn.addEventListener('click', function() {
            showNotification('سيتم فتح الخريطة قريباً 🗺️', 'success');
        });
    }
});

// ===== Smooth Scroll for Navigation =====
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
});

// ===== Update Active Nav on Scroll =====
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.dashboard-section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// ===== File Upload Simulation =====
document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.querySelector('.upload-area');
    const uploadBtn = uploadArea?.querySelector('.btn');
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            showNotification('تم اختيار الملفات بنجاح! 📷', 'success');
        });
    }
    
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#059669';
            uploadArea.style.background = '#D1FAE5';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#D1FAE5';
            uploadArea.style.background = '#F0FDF4';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#D1FAE5';
            uploadArea.style.background = '#F0FDF4';
            showNotification('تم رفع الصور بنجاح! 📷', 'success');
        });
    }
});

// ===== Property Card Click =====
document.addEventListener('DOMContentLoaded', () => {
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // منع فتح الـ modal عند النقر على زر المفضلة
            if (e.target.closest('.favorite-btn')) {
                return;
            }
            
            // الحصول على بيانات العقار من الكارد
            const title = this.querySelector('.property-info h4')?.textContent || 'عقار';
            const location = this.querySelector('.property-location')?.textContent || '';
            const price = this.querySelector('.property-price')?.textContent || '';
            const features = Array.from(this.querySelectorAll('.property-features span')).map(span => span.textContent);
            const propertyId = this.dataset.propertyId || Date.now().toString();
            
            openPropertyModal({
                id: propertyId,
                title: title,
                location: location,
                price: price,
                features: features
            });
        });
    });
});

// ===== Property Modal Functions =====
function openPropertyModal(property) {
    const modal = document.getElementById('propertyModal');
    const modalBody = document.getElementById('propertyModalBody');
    
    if (!modal || !modalBody) return;
    
    // حفظ معرف العقار الحالي
    modal.dataset.propertyId = property.id;
    
    // بناء محتوى الـ modal
    const featuresHTML = property.features.map(feature => {
        const icon = feature.includes('غرف') ? 'fa-bed' : 
                    feature.includes('حمام') ? 'fa-bath' : 
                    feature.includes('م²') ? 'fa-ruler-combined' : 'fa-home';
        return `
            <div class="property-modal-feature">
                <i class="fas ${icon}"></i>
                <span>${feature}</span>
            </div>
        `;
    }).join('');
    
    modalBody.innerHTML = `
        <div class="property-modal-details">
            <div class="property-modal-images">
                <div class="property-modal-main-image">
                    <i class="fas fa-building"></i>
                </div>
            </div>
            <div class="property-modal-info">
                <h3>${property.title}</h3>
                <div class="property-modal-price">${property.price}</div>
                <div class="property-modal-features">
                    ${featuresHTML}
                </div>
                <div class="property-modal-description">
                    <h4>الوصف</h4>
                    <p>${property.title} ${property.location}. عقار مميز بموقع استراتيجي ومواصفات عالية الجودة.</p>
                </div>
            </div>
        </div>
        <div class="property-modal-chat">
            <div class="property-modal-header">
                <h2>المحادثة</h2>
                <p><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
            </div>
            <div class="property-chat-container">
                <div class="property-chat-messages" id="propertyChatMessages_${property.id}">
                    ${loadPropertyMessages(property.id)}
                </div>
                <div class="property-chat-input-container">
                    <div class="property-chat-input-wrapper">
                        <input type="text" 
                               class="property-chat-input" 
                               id="propertyChatInput_${property.id}"
                               placeholder="اكتب رسالتك...">
                        <button class="property-chat-send" onclick="sendPropertyMessage('${property.id}')">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // إضافة event listener للإدخال
    const chatInput = document.getElementById(`propertyChatInput_${property.id}`);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendPropertyMessage(property.id);
            }
        });
    }
    
    // فتح الـ modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // التمرير للأسفل في المحادثة
    setTimeout(() => {
        const messagesContainer = document.getElementById(`propertyChatMessages_${property.id}`);
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, 100);
}

function closePropertyModal() {
    const modal = document.getElementById('propertyModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function sendPropertyMessage(propertyId) {
    const input = document.getElementById(`propertyChatInput_${propertyId}`);
    const messagesContainer = document.getElementById(`propertyChatMessages_${propertyId}`);
    
    if (!input || !messagesContainer) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // الحصول على المستخدم الحالي
    const currentUser = sessionStorage.getItem('currentUser');
    const user = currentUser ? JSON.parse(currentUser) : { name: 'مستخدم' };
    
    // إضافة الرسالة المرسلة
    const messageEl = document.createElement('div');
    messageEl.className = 'property-chat-message sent';
    messageEl.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(messageEl);
    
    // حفظ الرسالة
    savePropertyMessage(propertyId, {
        text: message,
        sender: user.name,
        timestamp: new Date().toISOString(),
        type: 'sent'
    });
    
    // مسح حقل الإدخال
    input.value = '';
    
    // التمرير للأسفل
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // رد تلقائي بعد 1.5 ثانية (اختياري)
    setTimeout(() => {
        const replyEl = document.createElement('div');
        replyEl.className = 'property-chat-message received';
        replyEl.innerHTML = `<p>شكراً لتواصلك! سنرد عليك في أقرب وقت 😊</p>`;
        messagesContainer.appendChild(replyEl);
        
        savePropertyMessage(propertyId, {
            text: 'شكراً لتواصلك! سنرد عليك في أقرب وقت 😊',
            sender: 'المالك',
            timestamp: new Date().toISOString(),
            type: 'received'
        });
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1500);
}

function savePropertyMessage(propertyId, message) {
    const key = `property_messages_${propertyId}`;
    const messages = JSON.parse(localStorage.getItem(key) || '[]');
    messages.push(message);
    localStorage.setItem(key, JSON.stringify(messages));
}

function loadPropertyMessages(propertyId) {
    const key = `property_messages_${propertyId}`;
    const messages = JSON.parse(localStorage.getItem(key) || '[]');
    
    if (messages.length === 0) {
        return '<div class="property-chat-message received"><p>مرحباً! كيف يمكنني مساعدتك؟</p></div>';
    }
    
    return messages.map(msg => {
        return `<div class="property-chat-message ${msg.type}"><p>${msg.text}</p></div>`;
    }).join('');
}

// إغلاق الـ modal عند النقر خارجها
document.addEventListener('click', (e) => {
    const modal = document.getElementById('propertyModal');
    if (modal && e.target.classList.contains('property-modal-overlay')) {
        closePropertyModal();
    }
});

// إغلاق الـ modal بالـ Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('propertyModal');
        if (modal && modal.classList.contains('active')) {
            closePropertyModal();
        }
    }
});

// ===== Agent Balance System =====
function getAgentBalance() {
    const balance = localStorage.getItem('agentBalance');
    return balance ? parseFloat(balance) : 500.00; // رصيد افتراضي 500 د.أ
}

function setAgentBalance(balance) {
    localStorage.setItem('agentBalance', balance.toString());
    updateAgentBalance();
}

function updateAgentBalance() {
    const balanceEl = document.getElementById('agentBalance');
    if (balanceEl) {
        const balance = getAgentBalance();
        balanceEl.textContent = balance.toFixed(2);
    }
}

// ===== Load Pending Properties =====
function loadPendingProperties() {
    const grid = document.getElementById('pendingPropertiesGrid');
    if (!grid) return;
    
    // بيانات تجريبية للعقارات المعلقة
    const pendingProperties = JSON.parse(localStorage.getItem('pendingProperties') || '[]');
    
    // إذا لم تكن هناك عقارات، أضف بعض البيانات التجريبية
    if (pendingProperties.length === 0) {
        const sampleProperties = [
            {
                id: 'pending_1',
                title: 'شقة فاخرة في عمان',
                location: 'عمان، الجبيهة',
                price: '150,000 د.أ',
                type: 'شقة',
                rooms: '3',
                baths: '2',
                area: '150',
                owner: 'محمد أحمد',
                fee: 15.50
            },
            {
                id: 'pending_2',
                title: 'فيلا حديثة في Abdoun',
                location: 'عبدون، عمان',
                price: '200,000 د.أ',
                type: 'منزل',
                rooms: '4',
                baths: '3',
                area: '250',
                owner: 'أحمد خالد',
                fee: 20.00
            },
            {
                id: 'pending_3',
                title: 'شقة بـ3 غرف نوم',
                location: 'الرصيفة، عمان',
                price: '120,000 د.أ',
                type: 'شقة',
                rooms: '3',
                baths: '2',
                area: '130',
                owner: 'خالد محمد',
                fee: 12.00
            }
        ];
        localStorage.setItem('pendingProperties', JSON.stringify(sampleProperties));
        grid.innerHTML = sampleProperties.map(prop => createPendingPropertyCard(prop)).join('');
    } else {
        grid.innerHTML = pendingProperties.map(prop => createPendingPropertyCard(prop)).join('');
    }
    
    // إضافة event listeners للأزرار
    attachPendingPropertyListeners();
}

function createPendingPropertyCard(property) {
    return `
        <div class="pending-property-card" data-property-id="${property.id}">
            <div class="pending-property-header">
                <div class="pending-property-owner">
                    <i class="fas fa-user"></i>
                    <div class="pending-property-owner-info">
                        <h4>${property.owner}</h4>
                        <p>صاحب العقار</p>
                    </div>
                </div>
                <span class="pending-property-status">في انتظار الموافقة</span>
            </div>
            <div class="pending-property-details">
                <h3>${property.title}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <div class="pending-property-features">
                    <span><i class="fas fa-home"></i> ${property.type}</span>
                    <span><i class="fas fa-bed"></i> ${property.rooms} غرف</span>
                    <span><i class="fas fa-bath"></i> ${property.baths} حمامات</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.area}م²</span>
                </div>
                <div class="pending-property-price">${property.price}</div>
                <div class="pending-property-actions">
                    <div class="pending-property-fee">
                        <div class="pending-property-fee-label">رسوم النشر</div>
                        <div class="pending-property-fee-amount">${property.fee.toFixed(2)} د.أ</div>
                    </div>
                    <button class="btn-accept" data-property-id="${property.id}" data-fee="${property.fee}">
                        <i class="fas fa-check"></i>
                        موافقة
                    </button>
                    <button class="btn-reject" data-property-id="${property.id}">
                        <i class="fas fa-times"></i>
                        رفض
                    </button>
                </div>
            </div>
        </div>
    `;
}

function attachPendingPropertyListeners() {
    // أزرار الموافقة
    document.querySelectorAll('.btn-accept').forEach(btn => {
        btn.addEventListener('click', function() {
            const propertyId = this.dataset.propertyId;
            const fee = parseFloat(this.dataset.fee);
            approveProperty(propertyId, fee);
        });
    });
    
    // أزرار الرفض
    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', function() {
            const propertyId = this.dataset.propertyId;
            rejectProperty(propertyId);
        });
    });
}

function approveProperty(propertyId, fee) {
    const currentBalance = getAgentBalance();
    
    // التحقق من كفاية الرصيد
    if (currentBalance < fee) {
        showNotification(`رصيدك غير كاف! المطلوب: ${fee.toFixed(2)} د.أ، المتاح: ${currentBalance.toFixed(2)} د.أ ❌`, 'error');
        return;
    }
    
    // خصم الرسوم
    const newBalance = currentBalance - fee;
    setAgentBalance(newBalance);
    
    // إزالة العقار من قائمة المعلقة
    const pendingProperties = JSON.parse(localStorage.getItem('pendingProperties') || '[]');
    const updatedProperties = pendingProperties.filter(prop => prop.id !== propertyId);
    localStorage.setItem('pendingProperties', JSON.stringify(updatedProperties));
    
    // إضافة العقار إلى العقارات المقبولة
    const approvedProperty = pendingProperties.find(prop => prop.id === propertyId);
    if (approvedProperty) {
        const approvedProperties = JSON.parse(localStorage.getItem('approvedProperties') || '[]');
        approvedProperties.push({
            ...approvedProperty,
            approvedAt: new Date().toISOString()
        });
        localStorage.setItem('approvedProperties', JSON.stringify(approvedProperties));
    }
    
    // إعادة تحميل القائمة
    loadPendingProperties();
    
    showNotification(`تمت الموافقة على العقار بنجاح! تم خصم ${fee.toFixed(2)} د.أ من رصيدك ✅`, 'success');
}

function rejectProperty(propertyId) {
    // إزالة العقار من قائمة المعلقة
    const pendingProperties = JSON.parse(localStorage.getItem('pendingProperties') || '[]');
    const updatedProperties = pendingProperties.filter(prop => prop.id !== propertyId);
    localStorage.setItem('pendingProperties', JSON.stringify(updatedProperties));
    
    // إعادة تحميل القائمة
    loadPendingProperties();
    
    showNotification('تم رفض العقار ❌', 'success');
}

console.log('%c🏠 Dashboard Loaded', 'color: #059669; font-size: 16px; font-weight: bold;');

