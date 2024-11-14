import React, { useState } from "react";
import {
  PlusIcon,
  PhotographIcon,
  ColorSwatchIcon,
} from "@heroicons/react/solid";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#292929"); // Default color for new notes
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isPopVisible, setIsPopVisible] = useState(false); // For showing/hiding the pop up for delete confirmation
  const [noteToDelete, setNoteToDelete] = useState(null); // To store the note that we want to delete
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState("");

  // Predefined color sets for each note
  const colorOptions = ["#ed5c53", "#84b6f4", "#77dd77", "#292929"];

  // CREATE a note function
  const handleAddNote = () => {
    if (!newNote.trim() && !newImage) return;
    const newNoteObj = {
      id: Date.now(),
      text: newNote,
      image: newImage,
      color: selectedColor,
    };
    setNotes([...notes, newNoteObj]);
    setNewNote("");
    setNewImage(null);
    setUploadedImage(null); // Reset image preview
    setSelectedColor("#292929"); // Reset color after each note is added
    setShowInput(false);
  };

  // UPLOAD image function
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Image file -> TODO: pdfs, words, excels.
      if (file.type.startsWith("image/")) {
        setUploadedImage(file); // Store the file to display it as a preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImage(reader.result);
        };
        reader.readAsDataURL(file); // Read the image file as base64
      } else {
        alert("Please upload a valid image file :)");
      }
    }
  };

  // ZOOM Functions /////
  const openZoom = (imageUrl) => {
    setZoomImage(imageUrl);
    setIsZoomOpen(true);
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
  };
  /////////////////////

  // Note EDITING function
  const handleEditNote = (id, text, image, color) => {
    setEditingNoteId(id);
    setEditedText(text);
    setEditedImage(image);
  };

  // SAVING edited note function
  const handleSaveEdit = () => {
    setNotes(
      notes.map((note) =>
        note.id === editingNoteId
          ? {
              ...note,
              text: editedText,
              image: editedImage,
              color: selectedColor,
            }
          : note
      )
    );
    setEditingNoteId(null);
    setEditedText("");
    setEditedImage(null);
    setSelectedColor("#292929"); // Reset color after saving - grey default
  };

  // DELETION note function
  const handleDeleteClick = (note) => {
    setNoteToDelete(note); // Set the note we want to delete
    setIsPopVisible(true); // Show the confirmation pop up
  };

  // DELETE note confirmation
  const handleConfirmDelete = () => {
    setNotes(notes.filter((note) => note.id !== noteToDelete.id)); // Delete the note
    setIsPopVisible(false); // Hide the pop up
    setNoteToDelete(null); // Clear the note to delete
  };

  // Cancel note deletion
  const handleCancelDelete = () => {
    setIsPopVisible(false); // Hide the pop up
    setNoteToDelete(null); // Clear the note to delete
  };

  //////

  // COLOR PICKER icon for note
  const handleColorIconClick = (noteId) => {
    // Color picker for the specific note
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? { ...note, showColorPicker: !note.showColorPicker }
          : note
      )
    );
  };

  // COLOR SELECTION for note
  const handleColorSelect = (noteId, color) => {
    // Update the note color and text color based on grey or pastel colors background
    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              color: color,
              textColor: color === "#292929" ? "#ffffff" : "#1b1b1b",
              showColorPicker: false,
            }
          : note
      )
    );
  };

  // Visualization //
  return (
    <section className="dash-header">
      {" "}
      Dashboard
      {/* CREATE NOTE button */}
      <button onClick={() => setShowInput(true)} className="dash-plus-button">
        <PlusIcon className="h-6 w-6" />
      </button>
      {/* INPUT text for new note */}
      {showInput && (
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="input-text"
          placeholder="Write a new note..."
        />
      )}
      {/* UPLOAD IMAGE for note*/}
      {showInput && (
        <div className="upload-section">
          <label htmlFor="file-input" className="upload-image-button">
            <PhotographIcon className="upload-image" />
            <input
              type="file"
              id="file-input"
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*" // Limit file types to images for now
            />
          </label>

          {/* Image preview */}
          {newImage && (
            <div className="image-preview-container">
              <img src={newImage} alt="Preview" className="image-preview" />
            </div>
          )}
        </div>
      )}
      {/* Save and Upload new note */}
      {showInput && (
        <div className="save-note-container">
          <button onClick={handleAddNote} className="save-note-button">
            Save Note
          </button>
        </div>
      )}
      {/* Gallery of Notes */}
      <div className="gallery">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note"
            style={{ backgroundColor: note.color }}
          >
            <div className="edit-delete-buttons">
              {editingNoteId === note.id ? (
                <>
                  <button onClick={handleSaveEdit} className="save-button">
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() =>
                    handleEditNote(note.id, note.text, note.image, note.color)
                  }
                  className="edit-button"
                >
                  <span className="icon">•••</span>
                </button>
              )}
              <button
                onClick={() => handleDeleteClick(note)}
                className="delete-button"
              >
                <span className="icon">🗑</span>
              </button>
            </div>

            {/* Display image in note */}
            {note.image && (
              <div className="note-image-container">
                <img
                  src={note.image}
                  alt="Uploaded"
                  className="note-image"
                  onClick={() => openZoom(note.image)}
                />
              </div>
            )}

            {/* Color Picker Icon Inside Each Note */}
            <div className="note-color-picker">
              <button
                onClick={() => handleColorIconClick(note.id)}
                className="color-picker-icon-button"
                style={{
                  display: "inline-block",
                  padding: "5px",
                  background: "transparent",
                  border: "none",
                }}
              >
                <ColorSwatchIcon className="h-4 w-4 text-wheat-700" />
              </button>

              {/* Toggle menu for color options */}
              {note.showColorPicker && (
                <div className="color-options-menu">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(note.id, color)}
                      style={{
                        backgroundColor: color,
                        border: "none",
                        width: "30px",
                        height: "30px",
                        margin: "5px",
                      }}
                      className="color-option-button"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              {editingNoteId === note.id ? (
                <div className="note-edit-container">
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="edit-textarea"
                  />
                </div>
              ) : (
                <p className="note-text" style={{ color: note.textColor }}>
                  {note.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* ZOOM for note images */}
      {isZoomOpen && (
        <div className="zoom-image" onClick={closeZoom}>
          <div className="zoom-content">
            <img
              src={zoomImage}
              alt="Expanded view"
              className="expanded-image"
            />
          </div>
        </div>
      )}
      {/* Pop up for Deleting Notes */}
      {isPopVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Are you sure you want to delete this note?</p>
            <div className="popup-buttons">
              <button onClick={handleConfirmDelete} className="confirm-button">
                Yes
              </button>
              <button onClick={handleCancelDelete} className="cancel-button">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
