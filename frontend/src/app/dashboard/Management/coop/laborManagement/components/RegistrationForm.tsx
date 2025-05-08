import React, { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FormData {
  fullName: string;
  epfNumber: string;
  age: string;
  role: string;
  skills: string;
  dateJoined: string;
  contactNumber: string;
  email: string;
}

export default function RegistrationForm() {
  const [form, setForm] = useState<FormData>({
    fullName: '',
    epfNumber: '',
    age: '',
    role: '',
    skills: '',
    dateJoined: '',
    contactNumber: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!form.fullName.trim() || 
        !form.epfNumber.trim() || 
        !form.age || 
        !form.role.trim() || 
        !form.skills.trim() || 
        !form.dateJoined || 
        !form.contactNumber.trim() || 
        !form.email.trim()) {
      setError('Please fill in all required fields');
      return false;
    }

    if (parseInt(form.age) < 18 || parseInt(form.age) > 100) {
      setError('Worker age must be between 18 and 100');
      return false;
    }

    if (!/^[0-9]{10}$/.test(form.contactNumber.replace(/[-\s]/g, ''))) {
      setError('Please enter a valid 10-digit contact number');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!form.skills.trim().split(',').filter(skill => skill.trim()).length) {
      setError('Please enter at least one skill');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Ensure skills is a string and handle empty cases
      const skillsString = form.skills || '';
      const skillsArray = skillsString
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean); // Remove empty strings

      const workerData = {
        fullName: form.fullName.trim(),
        epfNumber: form.epfNumber.trim(),
        age: parseInt(form.age),
        role: form.role.trim(),
        skills: skillsArray, // Now we're sure this is an array
        dateJoined: new Date(form.dateJoined).toISOString(),
        contactNumber: form.contactNumber.trim(),
        email: form.email.trim()
      };

      console.log('Sending worker data:', workerData); // Debug log

      const response = await fetch(`${API_URL}/workers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workerData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register worker');
      }

      console.log('Response:', data); // Debug log
      setSuccess('Worker registered successfully!');
      setForm({
        fullName: '',
        epfNumber: '',
        age: '',
        role: '',
        skills: '',
        dateJoined: '',
        contactNumber: '',
        email: '',
      });
    } catch (err) {
      console.error('Error:', err); // Debug log
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-6 shadow-sm">
      <div>
        <h3 className="text-xl font-semibold">Register New Worker</h3>
        <p className="text-gray-500 text-sm">Add a new worker to the harvest crew.</p>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Full name"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">EPF Number</label>
          <input
            type="text"
            name="epfNumber"
            value={form.epfNumber}
            onChange={(e) => setForm({ ...form, epfNumber: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="EPF12345"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="18"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Role</label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="e.g. Field Worker"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium">Skills (Comma separated)</label>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Harvesting, Planting, etc."
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Date Joined</label>
          <input
            type="date"
            name="dateJoined"
            value={form.dateJoined}
            onChange={(e) => setForm({ ...form, dateJoined: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="071-1234567"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="example@gmail.com"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-600 text-white px-6 py-2 rounded text-sm hover:bg-green-700 disabled:bg-green-400"
      >
        {isSubmitting ? 'Registering...' : 'Register Worker'}
      </button>
    </form>
  );
}