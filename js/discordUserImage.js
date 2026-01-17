function updateDiscordProfile(userId) {
    const targetUserId = userId || '1369404505439076443'; // YOUR ID ONLY
    const apiUrl = `https://api.lanyard.rest/v1/users/${targetUserId}`;
    
    console.log('🔄 Fetching Discord data for user:', targetUserId);
    console.log('📡 API URL:', apiUrl);
    
    fetch(apiUrl)
    .then(response => {
        console.log('📥 Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log('✅ Full response:', result);
        
        if (!result.success) {
            throw new Error('Lanyard API returned success: false. Make sure you joined the Lanyard Discord server!');
        }
        
        const data = result.data;
        console.log('✅ User data:', data);
        
        // Build Discord avatar URL
        const avatarHash = data.discord_user.avatar;
        const isAnimated = avatarHash && avatarHash.startsWith('a_');
        const extension = isAnimated ? 'gif' : 'png';
        const avatarUrl = `https://cdn.discordapp.com/avatars/${targetUserId}/${avatarHash}.${extension}?size=2048`;
        
        console.log('🖼️ Avatar URL:', avatarUrl);
        
        // Update BIG avatar
        const bigAvatar = document.querySelector('.avatar');
        if (bigAvatar) {
            bigAvatar.src = avatarUrl;
            console.log('✅ Big avatar updated');
        } else {
            console.warn('⚠️ Element .avatar not found');
        }
        
        // Update small Discord card avatar
        const smallAvatar = document.querySelector('.avatarImage');
        if (smallAvatar) {
            smallAvatar.src = avatarUrl;
            console.log('✅ Discord card avatar updated');
        } else {
            console.warn('⚠️ Element .avatarImage not found');
        }
        
        // Update status indicator
        const statusImg = document.querySelector('.discordStatus');
        if (statusImg) {
            const statusMap = {
                'online': 'img/online.png',
                'idle': 'img/idle.png',
                'dnd': 'img/dnd.png',
                'offline': 'img/offline.png'
            };
            const status = data.discord_status || 'offline';
            statusImg.src = statusMap[status] || 'img/offline.png';
            statusImg.alt = status;
            console.log('🟢 Status updated to:', status);
        } else {
            console.warn('⚠️ Element .discordStatus not found');
        }
        
        // Update username
        const usernameElement = document.querySelector('.discordUserDiv span');
        if (usernameElement && data.discord_user.username) {
            usernameElement.textContent = data.discord_user.username;
            console.log('👤 Username updated:', data.discord_user.username);
        }
        
    })
    .catch(error => {
        console.error('❌ Error fetching Lanyard data:', error);
        console.error('📋 Error details:', error.message);
        
        if (error.message.includes('404')) {
            console.error('🚨 404 Error: You need to join the Lanyard Discord server first!');
            console.error('🔗 Join here: https://discord.gg/lanyard');
        }
    });
}

// Page loaded - start updating profile
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Page loaded!');
    console.log('📍 Starting Discord profile update via Lanyard...');
    
    const userId = '1369404505439076443'; // ✅ ONLY YOUR ID - NO SWITCHING
    console.log('👤 Using User ID:', userId);
    
    // First update immediately
    updateDiscordProfile(userId);
    
    // Auto-update every 5 seconds
    setInterval(() => {
        console.log('⏰ Auto-updating profile...');
        updateDiscordProfile(userId);
    }, 5000);
    
    // Click avatars to force manual update
    const avatars = document.querySelectorAll('.avatar, .avatarImage');
    avatars.forEach(avatar => {
        if (avatar) {
            avatar.addEventListener('click', function() {
                console.log('🖱️ Avatar clicked - forcing manual update...');
                updateDiscordProfile(userId);
            });
            avatar.style.cursor = 'pointer';
            avatar.title = 'Click to refresh';
        }
    });
    
    console.log('✅ Script loaded successfully!');
});