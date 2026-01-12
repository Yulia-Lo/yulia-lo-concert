// Основные переменные
let selectedSeats = [];
let totalPrice = 0;
let backgroundMusicEnabled = true;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
    startCountdown();
    setupSeatListeners();
    setupMusicControl();
    
    // Автовоспроизведение музыки (с задержкой для разрешения браузера)
    setTimeout(() => {
        const music = document.getElementById('backgroundMusic');
        music.volume = 0.3;
        music.play().catch(e => {
            console.log("Автовоспроизведение заблокировано браузером");
        });
    }, 1000);
});

// Управление фоновой музыкой
function setupMusicControl() {
    const volumeSlider = document.getElementById('musicVolume');
    const music = document.getElementById('backgroundMusic');
    
    // Настройка громкости
    volumeSlider.addEventListener('input', function() {
        music.volume = this.value / 100;
    });
    
    // Установить начальную громкость
    music.volume = volumeSlider.value / 100;
}

// Включить/выключить музыку
function toggleBackgroundMusic() {
    const music = document.getElementById('backgroundMusic');
    const status = document.getElementById('musicStatus');
    
    if (backgroundMusicEnabled) {
        music.pause();
        status.textContent = 'Музыка: ВЫКЛ';
        backgroundMusicEnabled = false;
    } else {
        music.play();
        status.textContent = 'Музыка: ВКЛ';
        backgroundMusicEnabled = true;
    }
}

// Таймер обратного отсчета
function startCountdown() {
    const concertDate = new Date('2024-01-12T19:00:00').getTime();
    
    function update() {
        const now = new Date().getTime();
        const timeLeft = concertDate - now;
        
        if (timeLeft < 0) {
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        // Можно добавить отображение таймера если нужно
    }
    
    update();
    setInterval(update, 60000);
}

// Настройка кликов на места
function setupSeatListeners() {
    document.querySelectorAll('.seat:not(.occupied)').forEach(seat => {
        seat.addEventListener('click', function() {
            const seatNumber = this.getAttribute('data-seat');
            const seatPrice = parseInt(this.getAttribute('data-price')) || 0;
            
            const seatIndex = selectedSeats.findIndex(s => s.number === seatNumber);
            
            if (seatIndex === -1) {
                selectedSeats.push({
                    number: seatNumber,
                    price: seatPrice,
                    type: this.classList.contains('vip') ? 'VIP' : 'Стандарт'
                });
                this.classList.add('selected');
            } else {
                selectedSeats.splice(seatIndex, 1);
                this.classList.remove('selected');
            }
            
            updateCart();
        });
    });
}

// Обновление корзины
function updateCart() {
    document.querySelector('.cart-count').textContent = selectedSeats.length;
    
    totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    document.querySelector('.cart-total').textContent = totalPrice + ' ₽';
    
    const seatsList = document.getElementById('selectedSeatsList');
    const totalSeatsElement = document.getElementById('totalSeats');
    const totalPriceElement = document.getElementById('totalPrice');
    
    totalSeatsElement.textContent = selectedSeats.length;
    totalPriceElement.textContent = totalPrice;
    
    if (selectedSeats.length === 0) {
        seatsList.innerHTML = '<div class="empty-cart">Вы еще не выбрали места</div>';
        return;
    }
    
    seatsList.innerHTML = '';
    selectedSeats.forEach(seat => {
        const seatItem = document.createElement('div');
        seatItem.className = 'seat-item';
        seatItem.innerHTML = `
            <div>
                <strong>${seat.number}</strong>
                <small> (${seat.type})</small>
            </div>
            <div>
                <span>${seat.price} ₽</span>
                <button class="remove-seat" onclick="removeSeat('${seat.number}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        seatsList.appendChild(seatItem);
    });
}

// Удаление места
function removeSeat(seatNumber) {
    const seatIndex = selectedSeats.findIndex(s => s.number === seatNumber);
    if (seatIndex > -1) {
        selectedSeats.splice(seatIndex, 1);
    }
    
    const seatElement = document.querySelector(`.seat[data-seat="${seatNumber}"]`);
    if (seatElement) {
        seatElement.classList.remove('selected');
    }
    
    updateCart();
}

// Покупка билетов
function buyTickets() {
    if (selectedSeats.length === 0) {
        alert('Пожалуйста, выберите хотя бы одно место!');
        return;
    }
    
    // Показываем модальное окно
    document.getElementById('purchaseModal').style.display = 'flex';
    
    // Блокируем купленные места
    selectedSeats.forEach(seat => {
        const seatElement = document.querySelector(`.seat[data-seat="${seat.number}"]`);
        if (seatElement) {
            seatElement.classList.remove('selected');
            seatElement.classList.add('occupied');
            seatElement.style.cursor = 'not-allowed';
            seatElement.onclick = null;
        }
    });
    
    // Очищаем корзину
    selectedSeats = [];
    updateCart();
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('purchaseModal').style.display = 'none';
}

// Прокрутка к залу
function scrollToHall() {
    document.getElementById('hall').scrollIntoView({
        behavior: 'smooth'
    });
}

// Клик на корзину
document.getElementById('cartBtn').addEventListener('click', function() {
    document.getElementById('hall').scrollIntoView({
        behavior: 'smooth'
    });
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(event) {
    const modal = document.getElementById('purchaseModal');
    if (event.target === modal) {
        closeModal();
    }
});