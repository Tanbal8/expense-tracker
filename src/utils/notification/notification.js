import './notification.scss';

class notification {
    constructor(type, title, ...messages) {
        this.div = document.createElement('div');
        this.div.classList.add('hide-notification');
        this.div.classList.add('notification');
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('notification-status-icon');
        const notificationContent = document.createElement('div');
        notificationContent.classList.add('notification-content');
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('notification-title');
        titleDiv.textContent = title;
        notificationContent.appendChild(titleDiv);
        if (messages) {
            for (let message of messages) {
                let messageDiv = document.createElement('div');
                messageDiv.classList.add('notification-message');
                messageDiv.textContent = message;
                messageDiv.dir = 'auto';
                notificationContent.appendChild(messageDiv);
            }
        }
        this.div.appendChild(iconDiv);
        this.div.appendChild(notificationContent);
        if (notificationTypes[type]) {
            this.div.style.borderLeftColor = notificationTypes[type].color;
            this.div.style.borderRightColor = notificationTypes[type].color;
            const icon = document.createElement('i');
            icon.classList.add('fa', `fa-${notificationTypes[type].icon}`, notificationTypes[type].className);
            iconDiv.appendChild(icon);
        }
        this.div.onclick = () => {
            this.remove();
        }
        notificationDiv.appendChild(this.div);
        notifications.push(this.div);
        setTimeout(() => {
            this.div.classList.remove('hide-notification')
        }, 10);
        this.timeout = setTimeout(() => {
            this.remove();
        }, 5000);
    }
    remove() {
        this.div.classList.add('hide-notification');
        setTimeout(() => {
            notifications.splice(notifications.indexOf(this.div), 1);
            this.div.remove();
        }, 250);
    }
}

const notificationTypes = {
    success: {
        color: 'green',
        icon: 'check-circle',
        className: 'success-icon',
    },
    alert: {
        color: 'red',
        icon: 'times-circle',
        className: 'alert-icon',
    },
    message: {
        color: 'gold',
        icon: 'comment',
        className: 'message-icon',
    },
}

const notificationDiv = document.createElement('div');
notificationDiv.setAttribute('id', 'notifications-div');
document.body.appendChild(notificationDiv);
const notifications = [];

export default notification;