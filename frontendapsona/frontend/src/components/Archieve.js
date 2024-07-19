// src/pages/Archived.js
/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"
import Note from '../components/Note';

const Archived = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/notes/archived', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNotes(res.data);
  };

  const handleNoteUpdate = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note._id === updatedNote._id ? updatedNote : note))
    );
  };

  return (
    <div className="notes">
      <h2>Archived Notes</h2>
      {notes.map((note) => (
        <Note key={note._id} note={note} onNoteUpdate={handleNoteUpdate} />
      ))}
    </div>
  );
};

export default Archived;
*/

// src/pages/Notes.js
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
    
    const token = Cookies.get('token');
    const res = await axios.get('/api/notes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(res.data);
    
  };

  const fetchArchivedNotes = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    const res = await axios.get('/api/notes/archived', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setArchivedNotes(res.data);
    setLoading(false);
  };

  const fetchTrashedNotes = async () => {
    const token = Cookies.get('token');
    const res = await axios.get('/api/notes/trashed', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTrashedNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
    fetchArchivedNotes();
    fetchTrashedNotes();
  }, []);

  const handleEditNote = async (id, updatedNoteData) => {
    try {
      const token = Cookies.get('token');
      const res = await axios.put(`/api/notes/${id}`, updatedNoteData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? res.data : note))
      );
      
      fetchNotes();
      fetchTrashedNotes();
      fetchArchivedNotes();
    } catch (error) {
      console.error('Error editing note:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = Cookies.get('token');
    await axios.delete(`/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
    fetchTrashedNotes();
    fetchArchivedNotes();
  };

  const handleArchive = async (id) => {
    const token = Cookies.get('token');
    await axios.put(`/api/notes/${id}/archive`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
    fetchTrashedNotes();
    fetchArchivedNotes();
  };

  const handleTrash = async (id) => {
    const token = Cookies.get('token');
    await axios.put(`/api/notes/${id}/trash`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
    fetchTrashedNotes();
    fetchArchivedNotes();
  };

  const handleCreateNote = async (newNoteData) => {
    try {
      const token = Cookies.get('token');
      const res = await axios.post('/api/notes', newNoteData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prevNotes) => [...prevNotes, res.data]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <div className="notes">
      <h2>Archieved Notes</h2>

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
          
        {archivedNotes.map((note) => (
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
