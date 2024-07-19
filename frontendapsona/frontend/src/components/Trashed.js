
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Note from '../components/Note';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import CreateNotePopup from './CreateNotePopup';
import { Oval } from 'react-loader-spinner';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [trashedNotes, setTrashedNotes] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 

  const fetchNotes = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    const res = await axios.get('https://google-notes99.onrender.com/api/notes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(res.data);
    setLoading(false);
  };

  const fetchArchivedNotes = async () => {
    const token = Cookies.get('token');
    const res = await axios.get('https://google-notes99.onrender.com/api/notes/archived', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setArchivedNotes(res.data);
  };

  const fetchTrashedNotes = async () => {
    setLoading(true)
    const token = Cookies.get('token');
    const res = await axios.get('https://google-notes99.onrender.com/api/notes/trashed', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTrashedNotes(res.data);
    setLoading(false)
  };

  useEffect(() => {
    fetchNotes();
    fetchArchivedNotes();
    fetchTrashedNotes();
  }, []);

  const handleEditNote = async (id, updatedNoteData) => {
    try {
      const token = Cookies.get('token');
      const res = await axios.put(`https://google-notes99.onrender.com/api/notes/${id}`, updatedNoteData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? res.data : note))
      );
    } catch (error) {
      console.error('Error editing note:', error);
    }
    fetchNotes();
    fetchTrashedNotes();
    fetchArchivedNotes();
  };

  const handleDelete = async (id) => {
    const token = Cookies.get('token');
    await axios.delete(`https://google-notes99.onrender.com/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
    fetchTrashedNotes();
    fetchArchivedNotes();
  };

  const handleArchive = async (id) => {
    const token = Cookies.get('token');
    await axios.put(`https://google-notes99.onrender.com/api/notes/${id}/archive`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
    fetchTrashedNotes();
    fetchArchivedNotes();
  };

  const handleTrash = async (id) => {
    const token = Cookies.get('token');
    await axios.put(`https://google-notes99.onrender.com/api/notes/${id}/trash`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
    fetchTrashedNotes();
    fetchArchivedNotes();
  };


  return (
    <div className="notes">
      <h2>Trashed Notes</h2>

      {loading ? (
        <div className="spinner-container">
          <Oval
            height={80}
            width={80}
            color="yellow"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        <div className='containerscroll'>
          
        {trashedNotes.map((note) => (
          <Note
            key={note._id}
            note={note}
            onEdit={handleEditNote}
            
            onArchive={handleArchive}
            onTrash={handleTrash}
          />
        ))}
     </div> )}
      
    </div>
  );
};

export default Notes;
