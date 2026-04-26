import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Import your Redux action (adjust the path/name to match your slice)
// import { setUserData } from "../redux/authSlice"; 
import "./HomePage.css";
import useFetch from "../hooks/useFetch";
import useSubmit from "../hooks/useSubmit";
import StudentForm from "../components/StudentForm";
import "./StudentsSection.css";

const HomePage = () => {

  const { token, userdata } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Profile fetch
  const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useFetch("/api/auth/profile", { isAuth: true });
  // Students fetch
  const { data: studentsData, loading: studentsLoading, refetch: refetchStudents } = useFetch("/api/auth/students", { isAuth: true });

  // Submit hooks for add, update, delete
  const { submit: submitStudent, loading: submitLoading } = useSubmit({ isAuth: true });
  const { submit: updateStudent, loading: updateLoading } = useSubmit({ isAuth: true });
  const { submit: deleteStudent, loading: deleteLoading } = useSubmit({ isAuth: true });

  // UI state
  const [showAdd, setShowAdd] = useState(false);
  const [editStudent, setEditStudent] = useState(null);


  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!userdata && profileLoading) {
    return (
      <main className="home-page">
        <h2>Loading your profile...</h2>
      </main>
    );
  }
  if (!userdata && !profileLoading && !profileData) {
    return <Navigate to="/login" replace />;
  }
  // Fallback: If Redux hasn't updated yet, use local 'data'
  const activeUser = userdata || profileData;

  const initials = activeUser?.fullName
    ? activeUser.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("")
    : "NA";

  const joinedDate = activeUser?.createdAt
    ? new Date(activeUser.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    : "Not available";

  // --- Student Management Handlers ---
  const handleAddStudent = async (form) => {
    const res = await submitStudent("/register", form);
    if (res?.ok) {
      setShowAdd(false);
      refetchStudents();
    }
  };
  const handleEditStudent = (student) => setEditStudent(student);
  const handleUpdateStudent = async (form) => {
    const res = await updateStudent(`/student/${editStudent.id || editStudent._id}`, form, { method: "PUT" });
    if (res?.ok) {
      setEditStudent(null);
      refetchStudents();
    }
  };
  const handleDeleteStudent = async (student) => {
    if (!window.confirm("Delete this student?")) return;
    const res = await deleteStudent(`/student/${student.id || student._id}`, {}, { method: "DELETE" });
    if (res?.ok) refetchStudents();
  };

  return (
    <main className="home-page">
      {/* --- Student Management Section --- */}
      <section className="students-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Manage Students</h2>
          <button onClick={() => setShowAdd((v) => !v)}>{showAdd ? "Close" : "Add Student"}</button>
        </div>
        {showAdd && (
          <StudentForm onSubmit={handleAddStudent} loading={submitLoading} />
        )}
        {editStudent && (
          <StudentForm
            onSubmit={handleUpdateStudent}
            loading={updateLoading}
            initialData={editStudent}
            onCancel={() => setEditStudent(null)}
          />
        )}
        {studentsLoading ? (
          <p>Loading students...</p>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Fee Paid</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentsData?.students?.length ? (
                studentsData.students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.fullName}</td>
                    <td>{student.email}</td>
                    <td>{student.studentclass}</td>
                    <td>{student.isFeePaid ? "Yes" : "No"}</td>
                    <td>
                      <button onClick={() => handleEditStudent(student)}>Edit</button>
                      <button onClick={() => handleDeleteStudent(student)} disabled={deleteLoading}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
};

export default HomePage;