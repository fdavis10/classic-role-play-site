from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_verification_email(user, token):
    verification_url = f"{settings.FRONTEND_URL}/verify-email/{token}/"
    
    from_email = settings.DEFAULT_FROM_EMAIL if settings.DEFAULT_FROM_EMAIL else (settings.EMAIL_HOST_USER if settings.EMAIL_HOST_USER else 'noreply@classicproject.local')
    
    subject = 'Подтверждение email адреса - Classic Project'
    
    context = {
        'username': user.username,
        'verification_url': verification_url,
    }
    
    html_message = render_to_string('email/verification_email.html', context)
    
    text_message = f'''
Здравствуйте, {user.username}!

Для подтверждения вашего email адреса перейдите по следующей ссылке:
{verification_url}

Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.

С уважением,
Команда Classic Project
'''
    
    logger.info(f'Попытка отправить письмо для пользователя {user.username} на {user.email}')
    logger.info(f'EMAIL_BACKEND: {settings.EMAIL_BACKEND}')
    logger.info(f'EMAIL_HOST: {settings.EMAIL_HOST}')
    logger.info(f'EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}')
    logger.info(f'FROM_EMAIL: {from_email}')
    
    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_message,
            from_email=from_email,
            to=[user.email]
        )
        msg.attach_alternative(html_message, "text/html")
        result = msg.send()
        
        logger.info(f'Письмо успешно отправлено для пользователя {user.username}. Результат: {result}')
    except Exception as e:
        error_msg = f'Ошибка при отправке письма для пользователя {user.username} на {user.email}: {str(e)}'
        logger.error(error_msg)
        print(f'ERROR: {error_msg}')
        
        if settings.EMAIL_BACKEND == 'django.core.mail.backends.console.EmailBackend':
            logger.warning('Используется консольный бэкенд, письмо должно быть в консоли')
        elif not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
            logger.warning('EMAIL_HOST_USER или EMAIL_HOST_PASSWORD не настроены. Письмо не может быть отправлено через SMTP.')
            logger.warning('Установите переменные окружения EMAIL_HOST_USER и EMAIL_HOST_PASSWORD для отправки через SMTP.')
            logger.warning('Или установите EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend для тестирования.')
        else:
            raise
