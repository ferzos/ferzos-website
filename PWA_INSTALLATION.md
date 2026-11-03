# PWA Installation Notifications

This feature adds a beautiful, user-friendly notification that prompts users to install your Ferzos app to their phones as a PWA (Progressive Web App).

## What was added

### 1. **Hook: `usePWAInstall`** ([src/hooks/usePWAInstall.ts](/src/hooks/usePWAInstall.ts))

- Manages PWA installation state and events
- Listens for the `beforeinstallprompt` event (fired by browsers when PWA is installable)
- Detects if the app is already installed
- Handles the installation flow
- Returns functions to trigger installation and dismiss the prompt

### 2. **Component: `PWAInstallPrompt`** ([src/components/PWAInstallPrompt.tsx](/src/components/PWAInstallPrompt.tsx))

- Displays a beautiful notification card at the bottom of the screen
- Shows only when the PWA is installable (on supported devices)
- Includes "Install" and "Later" buttons
- Responsive design that works on mobile and desktop
- Automatically hides after user installs or dismisses

### 3. **Integration in Layout** ([src/app/layout.tsx](/src/app/layout.tsx))

- `PWAInstallPrompt` is now included in the root layout
- Appears globally across all pages

## How it works

1. **On page load**: The hook checks if the browser supports PWA installation and listens for the `beforeinstallprompt` event
2. **When installable**: The notification appears showing "Install Ferzos - Get quick access to tools on your phone"
3. **User clicks Install**: Triggers the native browser install prompt
4. **User dismisses**: Can click "Later" to hide the notification
5. **After install**: The prompt automatically disappears and doesn't show again

## Browser support

This works on:

- ✅ Chrome/Chromium-based browsers (Android)
- ✅ Edge (Windows, Android)
- ✅ Samsung Internet
- ✅ Opera
- ⚠️ Firefox (limited support)
- ⚠️ Safari (requires manual installation via share menu)

## Customization

### Change the notification appearance

Edit [src/components/PWAInstallPrompt.tsx](/src/components/PWAInstallPrompt.tsx):

- Modify the Tailwind classes to change colors, positioning, or animation
- Edit the title "Install Ferzos" and description text

### Change installation triggers

The prompt only shows when:

1. User is on a compatible browser/device
2. The PWA hasn't been installed yet
3. The browser's `beforeinstallprompt` event fires

You can add logic to delay the prompt by modifying `PWAInstallPrompt.tsx`:

```tsx
const [isVisible, setIsVisible] = useState(false);
const [showAfterMs, setShowAfterMs] = useState(0);

useEffect(() => {
  if (!canInstall) return;

  // Show after 5 seconds
  const timeout = setTimeout(() => setIsVisible(true), 5000);
  return () => clearTimeout(timeout);
}, [canInstall]);
```

### Track installation analytics

Add to `handleInstall` in [src/hooks/usePWAInstall.ts](/src/hooks/usePWAInstall.ts):

```tsx
if (result.outcome === "accepted") {
  // Track installation event
  console.log("User installed the PWA");
  // Send to your analytics
}
```

## What's already configured

Your PWA is fully configured thanks to existing files:

- ✅ [src/app/manifest.ts](/src/app/manifest.ts) - Web app manifest
- ✅ [public/sw.js](/public/sw.js) - Service worker for offline support
- ✅ [src/app/service-worker-registration.tsx](/src/app/service-worker-registration.tsx) - Service worker registration
- ✅ Icons - 192x192 and 512x512 app icons

## Testing

1. **On Android Chrome**: Open the app on Chrome, wait for the banner (may appear after visiting 2+ times with a few days gap)
2. **On desktop**: Some browsers show installation prompts in certain conditions
3. **Dev testing**: Use Chrome DevTools:
   - Open DevTools > Application > Manifest tab
   - You should see your manifest with icons and installation paths
   - The `beforeinstallprompt` event will fire based on browser criteria

## Troubleshooting

**Notification doesn't appear:**

- Check if you're on a supported browser (Chrome, Edge, Samsung Internet)
- The browser may have specific engagement metrics before showing the prompt
- Try installing the app from browser menu instead (⋮ > "Install app")

**Installation fails:**

- Ensure the service worker is registered (check browser console)
- Check that manifest.json is valid (DevTools > Application > Manifest)
- Some corporate networks may block installation

**Testing in development:**

- Use `npm run dev` to start the dev server
- The service worker only registers in production mode
- For local testing, build with `npm run build && npm start`
