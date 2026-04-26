import React, { useState } from "react";

const StudentForm = ({ onSubmit, loading, initialData, onCancel }) => {
    const [form, setForm] = useState(
        initialData || {
            fullName: "",
            email: "",
            password: "",
            studentclass: "",
            isFeePaid: false,
            role: "student",
        }
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form className="student-form" onSubmit={handleSubmit}>
            <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
            />
            <input
                name="email"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
            />
            {!initialData && (
                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            )}
            <input
                name="studentclass"
                placeholder="Class"
                value={form.studentclass}
                onChange={handleChange}
                required
            />
            <label>
                <input
                    name="isFeePaid"
                    type="checkbox"
                    checked={form.isFeePaid}
                    onChange={handleChange}
                />
                Fee Paid
            </label>
            <button type="submit" disabled={loading}>
                {initialData ? "Update" : "Add"} Student
            </button>
            {onCancel && (
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
};

export default StudentForm;
