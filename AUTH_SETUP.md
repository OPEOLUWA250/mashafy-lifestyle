# Admin Authentication Setup

## How to Login

The admin dashboard is now protected with email and password authentication.

### 1. Configure Your Credentials

Edit your `.env.local` file in the project root and update these lines with your preferred email and password:

```env
VITE_ADMIN_EMAIL=your_email@example.com
VITE_ADMIN_PASSWORD=your_secure_password_here
```

### Example `.env.local`:

```env
VITE_SUPABASE_URL=https://oadjbgvjxqkseyimfdqd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_9j8XN6pM3HSPQAihymcX9A_PvU_S8Kw

# Admin Login Credentials
VITE_ADMIN_EMAIL=opeoluwa@mashafy.com
VITE_ADMIN_PASSWORD=SecurePassword123!
```

### 2. Login Process

1. Visit your app and go to `/admin` or `/admin/login`
2. You'll be redirected to the login page
3. Enter your email and password
4. Click **Login**
5. You'll be redirected to the admin dashboard

### 3. Features

- **Email-based login**: Use your email address to authenticate
- **Session persistence**: Your login session is saved in browser storage
- **Logout button**: Click the **Logout** button (red button) in the dashboard to logout
- **Protected routes**: All admin pages require authentication
- **Automatic redirect**: Unauthenticated users are redirected to login

### 4. Important Notes

⚠️ **For Production**:

- This is a basic authentication system using environment variables
- For production, consider using Supabase Authentication for better security
- Never commit `.env.local` to version control (it's typically in `.gitignore`)
- Always use strong, unique passwords
- Consider implementing token-based authentication

### 5. Logout

Click the **Logout** button in the dashboard header to logout. You'll be redirected to the login page.

## Troubleshooting

**"Invalid email or password"**

- Check that your email and password in `.env.local` match exactly what you're entering
- Make sure there are no extra spaces in the `.env.local` file
- Restart your dev server after changing `.env.local`

**Login page keeps redirecting**

- Ensure `VITE_ADMIN_EMAIL` and `VITE_ADMIN_PASSWORD` are set in `.env.local`
- Check browser console for error messages
- Clear browser cache/localStorage and try again

**Session not persisting**

- Check if localStorage is enabled in your browser
- Try logging in again in a private/incognito window
