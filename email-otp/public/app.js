const API_BASE_URL = 'http://localhost:5000/api/otp';

let currentEmail = '';

async function sendOTP() {
  const email = document.getElementById('email').value.trim();
  
  if (!email) {
    alert('Please enter your email');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send OTP');
    }

    currentEmail = email;
    document.getElementById('user-email').textContent = email;
    document.getElementById('send-otp-section').classList.add('hidden');
    document.getElementById('verify-otp-section').classList.remove('hidden');
  } catch (error) {
    alert(error.message);
  }
}

async function verifyOTP() {
  const otp = document.getElementById('otp').value.trim();
  
  if (!otp || otp.length !== 6) {
    alert('Please enter a valid 6-digit OTP');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: currentEmail,
        otp 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify OTP');
    }

    document.getElementById('verify-otp-section').classList.add('hidden');
    document.getElementById('success-message').classList.remove('hidden');
  } catch (error) {
    alert(error.message);
  }
}

function resetForm() {
  document.getElementById('email').value = '';
  document.getElementById('otp').value = '';
  document.getElementById('verify-otp-section').classList.add('hidden');
  document.getElementById('send-otp-section').classList.remove('hidden');
  document.getElementById('success-message').classList.add('hidden');
}
