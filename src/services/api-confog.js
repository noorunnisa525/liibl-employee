// Authentication

export const employee_login = '/login';
export const create_account = '/register/employee';
export const forgot_password = '/forgot_password';
export const verify_phone = '/verify_phone';
export const resend_phone_verification_otp = '/resend_phone_verification_otp';
export const forgot_password_verify_otp = '/forgot_password_verify_otp';
export const reset_password = '/reset_password';
export const get_categories = '/get_categories';
export const get_sub_categories = '/get_sub_categories';
export const get_skills = '/get_skills';
export const update_profile = '/employee/update';

//SocialLogin
export const google_login = '/social_login';

//Home
export const get_jobs = '/jobs/get_jobs?page=';
export const send_proposal = '/send_proposal';
export const view_business = '/view_business?id=';

//Our Job
export const get_employee_invited_jobs =
  '/jobs/get_employee_invited_jobs?page=';
export const get_employee_active_jobs = '/jobs/get_employee_active_jobs?page=';

export const get_employee_inprogress_jobs =
  '/jobs/get_employee_inprogress_jobs?page=';
export const get_employee_completed_jobs =
  '/jobs/get_employee_completed_jobs?page=';
export const reject_job_invite = '/reject_job_invite';

export const accept_job_invite = '/accept_job_invite';
export const cancel_job = '/jobs/cancel_job';

//ViewJob

export const view_job_details = '/jobs/view_job?job_id=';

//Account
export const get_view_employee = '/get_employees';
export const account_change_password = '/change_password';
export const profile_visibility = '/profile/visibility';

//Reviews
export const give_reviews = '/review/employee_review';
export const get_reviews = '/employee/review';

//Chat
export const get_all_chats = '/get-current-chats?page=';
export const get_chat = '/get-chat?page=';
export const create_chat = '/create-chat';
export const find_chat = '/find-chat';
export const add_message = '/add-message';

//Notifications
export const get_notifications = '/get_notifications';
