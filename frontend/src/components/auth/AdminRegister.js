// Register.js
import { useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [areaId, setAreaId] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, phone, email, address, areaId }),
    });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
        <input type="text" value={areaId} onChange={(e) => setAreaId(e.target.value)} placeholder="Area ID" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
