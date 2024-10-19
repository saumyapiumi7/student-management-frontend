import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import './App.css';
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [studentLoaded, setStudentLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', date: '', reg: '' });
  const [isEditing, setIsEditing] = useState(false); // New state to track if we are updating
  const [currentStudentId, setCurrentStudentId] = useState(null); // Track the ID of the student being edited

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("https://4-x6hwqoqi.b4a.run/student");
        setStudents(res.data);
        setStudentLoaded(true);
      } catch (err) {
        console.error("Error fetching students: ", err);
      }
    };

    if (!studentLoaded) {
      fetchStudents();
    }
  }, [studentLoaded]);

  const handleInputChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value
    });
  };

  // Function to add a new student
  const addStudent = async () => {
    try {
      const res = await axios.post("https://4-x6hwqoqi.b4a.run/student", newStudent);
      if (res.status === 200) {
        alert("Student added successfully");
        setStudents([...students, res.data]); // Update student list with new student
      }
    } catch (err) {
      console.error("Error adding student: ", err);
      alert("Error: Could not add student.");
    }
    setIsModalOpen(false);
    setNewStudent({ name: '', date: '', reg: '' });
  };

  // Function to edit a student
  const editStudent = (student) => {
    setIsEditing(true);
    setCurrentStudentId(student._id); // Assuming each student has a unique _id
    setNewStudent({ name: student.name, date: student.date, reg: student.reg });
    setIsModalOpen(true);
  };

  // Function to update a student
  const updateStudent = async () => {
    try {
      const res = await axios.put(`https://4-x6hwqoqi.b4a.run/student/${currentStudentId}`, newStudent);
      if (res.status === 200) {
        alert("Student updated successfully");
        setStudents(students.map(student => student._id === currentStudentId ? res.data : student)); // Update the list
      }
    } catch (err) {
      console.error("Error updating student: ", err);
      alert("Error: Could not update student.");
    }
    setIsModalOpen(false);
    setNewStudent({ name: '', date: '', reg: '' });
    setIsEditing(false);
    setCurrentStudentId(null);
  };

  // Function to delete a student
  const deleteStudent = async (reg) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (!confirmDelete) {
      return;
    }
    try {
      await axios.delete(`https://4-x6hwqoqi.b4a.run/student/${reg}`);
      setStudents(students.filter(student => student.reg !== reg));
      alert("Student deleted successfully");
    } catch (err) {
      console.error("Error deleting student: ", err);
      alert("Error: Could not delete student.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center p-6">
      {/* Add Student Button */}
      <button 
        className="fixed bottom-6 right-6 bg-blue-600 p-4 rounded-full text-white shadow-lg hover:bg-blue-700 transition duration-300" 
        onClick={() => {
          setIsEditing(false); // Ensure modal is for adding when opened
          setIsModalOpen(true);
        }}>
        <FaPlus />
      </button>

      {/* Student List */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Student List</h1>
        
        <div className="overflow-x-auto max-h-80 overflow-y-scroll">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white text-left text-sm uppercase font-semibold tracking-wider">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Reg No</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {students.map((std, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out">
                  <td className="py-3 px-4">{std.name}</td>
                  <td className="py-3 px-4">{std.date}</td>
                  <td className="py-3 px-4">{std.reg}</td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 mx-2"
                      onClick={() => editStudent(std)}>
                      <FaEdit />
                    </button>
                    <button 
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 mx-2"
                      onClick={() => deleteStudent(std.reg)}>
                      <FaRegTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding/Editing Student */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Student" : "Add New Student"}</h2>
            <form onSubmit={(e) => { e.preventDefault(); isEditing ? updateStudent() : addStudent(); }}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={newStudent.name} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={newStudent.date} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Reg No</label>
                <input 
                  type="text" 
                  name="reg" 
                  value={newStudent.reg} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="mr-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300" 
                  onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
