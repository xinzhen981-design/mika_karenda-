// 本番環境：各日付の解放時刻を生成（午前7時）
function generateUnlockSchedule() {
    const schedule = {};
    for (let day = 1; day <= 30; day++) {
        schedule[day] = new Date(`2025-11-${String(day).padStart(2, '0')}T07:00:00`);
    }
    return schedule;
}

const unlockSchedule = generateUnlockSchedule();

// 各日付の確認メッセージ（朝用）
const confirmMessages = {
    1: 'おはよう♡\n1日の音声を聴く？',
    2: '今日も素敵な1日にしようね♡\n2日の音声を聴く？',
    3: '朝だよ♡\n3日の音声を聴く？',
    4: '今日も応援してるよ♡\n4日の音声を聴く？',
    5: 'おはよう！今日も頑張ろうね♡\n5日の音声を聴く？',
    6: '素敵な朝だね♡\n6日の音声を聴く？',
    7: '1週間お疲れさま♡\n7日の音声を聴く？',
    8: 'おはよう♡\n8日の音声を聴く？',
    9: '今日もいい日になりますように♡\n9日の音声を聴く？',
    10: '10日目だね♡\n音声を聴く？',
    11: 'おはよう♡\n11日の音声を聴く？',
    12: '今日も応援してるよ♡\n12日の音声を聴く？',
    13: '朝だよ♡\n13日の音声を聴く？',
    14: 'おはよう！元気だしてね♡\n14日の音声を聴く？',
    15: '半分きたね♡\n15日の音声を聴く？',
    16: 'おはよう♡\n16日の音声を聴く？',
    17: '今日も素敵な1日にしようね♡\n17日の音声を聴く？',
    18: 'おはよう♡\n18日の音声を聴く？',
    19: '今日も頑張ろうね♡\n19日の音声を聴く？',
    20: '20日目♡\n音声を聴く？',
    21: 'おはよう♡\n21日の音声を聴く？',
    22: '週末だね♡\n22日の音声を聴く？',
    23: 'おはよう♡\n23日の音声を聴く？',
    24: '今日も応援してるよ♡\n24日の音声を聴く？',
    25: 'おはよう♡\n25日の音声を聴く？',
    26: '今日も素敵な1日にしようね♡\n26日の音声を聴く？',
    27: 'おはよう♡\n27日の音声を聴く？',
    28: 'もうすぐ終わりだね♡\n28日の音声を聴く？',
    29: 'おはよう♡\n29日の音声を聴く？',
    30: '最終日♡ありがとう♡\n30日の音声を聴く？'
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
        
        // 全ての日付にクリックイベントを追加
        dayElement.addEventListener('click', () => playAudio(day));
        dayButtons[day] = dayElement; // 参照を保持
        
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
    
    for (let day = 1; day <= 30; day++) {
        const button = dayButtons[day];
        const unlockTime = unlockSchedule[day];
        
        // 次の日の午前7時を計算（ロック時刻）
        const lockTime = day < 30 
            ? unlockSchedule[day + 1] 
            : new Date('2025-12-01T07:00:00'); // 30日の場合は12月1日午前7時
        
        // 解放条件：解放時刻を過ぎている かつ ロック時刻前
        if (now >= unlockTime && now < lockTime) {
            // 解放済み：ボタンを有効化
            button.classList.add('unlocked');
            button.classList.remove('locked');
        } else {
            // 未解放またはロック済み：ボタンを無効化
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
        const now = new Date();
        const unlockTime = unlockSchedule[day];
        const lockTime = day < 30 
            ? unlockSchedule[day + 1] 
            : new Date('2025-12-01T07:00:00');
        
        let message;
        if (now < unlockTime) {
            // まだ解放されていない
            const timeString = unlockTime.toLocaleString('ja-JP', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            message = `この音声は ${timeString} に解放されます♡`;
        } else if (now >= lockTime) {
            // 期限切れ
            message = 'この音声の再生期限が過ぎました💦\n次の音声を楽しみにしていてね♡';
        }
        
        alert(message);
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

