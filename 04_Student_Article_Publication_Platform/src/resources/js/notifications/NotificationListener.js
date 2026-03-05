// NotificationListener.js
// Handles real-time notifications for new articles and comment replies.
// Configure Echo and Pusher keys in one place for easy setup.

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// TODO: Set these from .env or a config file for your environment
const PUSHER_KEY = import.meta.env.VITE_PUSHER_APP_KEY || 'your-pusher-key';
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1';

export let echo = null;

export function initEcho(userId) {
    if (echo) return echo;
    window.Pusher = Pusher;
    echo = new Echo({
        broadcaster: 'pusher',
        key: PUSHER_KEY,
        cluster: PUSHER_CLUSTER,
        forceTLS: true,
        encrypted: true,
        authEndpoint: '/broadcasting/auth',
    });

    // Listen for new published articles
    echo.channel('articles')
        .listen('NewArticlePublished', (data) => {
            window.dispatchEvent(new CustomEvent('notify:new-article', { detail: data }));
        });

    // Listen for replies to this user's comments
    if (userId) {
        echo.private(`user.${userId}`)
            .listen('CommentReplied', (data) => {
                window.dispatchEvent(new CustomEvent('notify:comment-reply', { detail: data }));
            });
    }
    return echo;
}
