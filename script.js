// テスト用：各日付の解放時刻を設定
const unlockSchedule = {
    1: new Date('2025-10-27T21:15:00'),
    2: new Date('2025-10-27T21:17:00'),
    3: new Date('2025-10-27T21:19:00'),
    4: new Date('2025-10-27T21:21:00'),
    5: new Date('2025-10-27T21:23:00')
};

// 各日付の確認メッセージ（朝用）
const confirmMessages = {
    1: 'おはよう♡\n1日の音声を聴く？',
    2: '今日も素敵な1日にしようね♡\n2日の音声を聴く？',
    3: '朝だよ♡\n3日の音声を聴く？',
    4: '今日も応援してるよ♡\n4日の音声を聴く？',
    5: '5日目の朝♡\n音声を聴く？'
};

// 日付ボタンの参照を保持
const dayButtons = {};

// 2025年11月のカレンダーを生成
function generateCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    
    // 2025年11月1日は土曜日（曜日番号: 6）
    // 11月は30日まで
    const firstDayOfWeek = 6; // 土曜日（0=日曜日, 6=土曜日）
    const daysInMonth = 30;
    
    // 空白セルを追加（11月1日が土曜日なので、日曜から金曜までの6個の空白）
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        calendarDays.appendChild(emptyDay);
    }
    
    // 1日から30日までのボタンを生成
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('button');
        dayElement.className = 'day';
        dayElement.textContent = day;
        dayElement.dataset.day = day; // data属性に日付を保存
        
        // 曜日を計算（0=日曜日, 6=土曜日）
        const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
        
        // 曜日に応じたクラスを追加
        if (dayOfWeek === 0) {
            dayElement.classList.add('sunday');
        } else if (dayOfWeek === 6) {
            dayElement.classList.add('saturday');
        } else {
            dayElement.classList.add('weekday');
        }
        
        // テスト環境：1～5日は音声ファイルが利用可能
        if (day >= 1 && day <= 5) {
            dayElement.addEventListener('click', () => playAudio(day));
            dayButtons[day] = dayElement; // 参照を保持
        } else {
            // 6日以降は音声ファイルがないので無効化
            dayElement.classList.add('disabled');
        }
        
        calendarDays.appendChild(dayElement);
    }
    
    // 初回の状態更新
    updateButtonStates();
    
    // 1秒ごとに状態をチェック
    setInterval(updateButtonStates, 1000);
}

// ボタンの有効/無効状態を更新
function updateButtonStates() {
    const now = new Date();
    
    for (let day = 1; day <= 5; day++) {
        const button = dayButtons[day];
        const unlockTime = unlockSchedule[day];
        
        if (now >= unlockTime) {
            // 解放済み：ボタンを有効化
            button.classList.add('unlocked');
            button.classList.remove('locked');
        } else {
            // 未解放：ボタンを無効化
            button.classList.add('locked');
            button.classList.remove('unlocked');
        }
    }
}

// カスタムポップアップを表示する関数
function showConfirmPopup(message, onConfirm, onCancel) {
    // オーバーレイを作成
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    
    // ポップアップを作成
    const popup = document.createElement('div');
    popup.className = 'popup';
    
    // メッセージを作成
    const messageElement = document.createElement('p');
    messageElement.className = 'popup-message';
    messageElement.textContent = message;
    
    // ボタンコンテナを作成
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'popup-buttons';
    
    // OKボタン
    const okButton = document.createElement('button');
    okButton.className = 'popup-button popup-button-ok';
    okButton.textContent = '聴く♡';
    okButton.onclick = () => {
        document.body.removeChild(overlay);
        if (onConfirm) onConfirm();
    };
    
    // キャンセルボタン
    const cancelButton = document.createElement('button');
    cancelButton.className = 'popup-button popup-button-cancel';
    cancelButton.textContent = 'あとで';
    cancelButton.onclick = () => {
        document.body.removeChild(overlay);
        if (onCancel) onCancel();
    };
    
    // 要素を組み立て
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(okButton);
    popup.appendChild(messageElement);
    popup.appendChild(buttonContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // アニメーション用に少し遅延
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
}

// 音声を再生する関数
function playAudio(day) {
    const button = dayButtons[day];
    
    // 未解放の場合は再生しない
    if (button.classList.contains('locked')) {
        const unlockTime = unlockSchedule[day];
        const timeString = unlockTime.toLocaleString('ja-JP', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        alert(`この音声は ${timeString} に解放されます。`);
        return;
    }
    
    // 確認メッセージを表示
    const message = confirmMessages[day] || `おはよう♡\n${day}日の音声を聴く？`;
    
    showConfirmPopup(message, () => {
        // OKが押された場合：音声を再生
        const audioFileName = `声${day}.wav`;
        const audio = new Audio(audioFileName);
        
        audio.play().catch(error => {
            console.error(`音声ファイルの再生に失敗しました: ${audioFileName}`, error);
            alert(`音声ファイル「${audioFileName}」の再生に失敗しました。`);
        });
        
        // ボタンのフィードバック
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }, () => {
        // キャンセルが押された場合：何もしない
    });
}

// ページ読み込み時にカレンダーを生成
document.addEventListener('DOMContentLoaded', generateCalendar);

