import _, { update } from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import React from "react";
import {
  PlusIcon,
  PhotographIcon,
  ColorSwatchIcon,
} from "@heroicons/react/solid";
import "./Dashboard.css";

const ReactGridLayout = WidthProvider(RGL);

export default class BasicLayout extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    onLayoutChange: function () {},
    cols: 4,
  };

  // Props for notes
  constructor(props) {
    super(props);
    this.state = {
      layout: [],
      notes: [],
      newNote: "",
      showInput: false,
      newImage: "", // Holds the base64 image data for the preview
      uploadedImage: null, // Stores the image file for further processing (uploading to server, etc.)
      editingNoteId: null, // ID of the note being edited
      editedNoteText: "", // Edited text for the note
      editedNoteImage: null, // Edited image for the note
      backgroundColor: "#292929", // Default color
      isZoomed: false, // Controls whether the zoom is open or not
      zoomedImageSrc: "", // Holds the source of the image to zoom in
      showDeleteModal: false, // Controls whether the delete modal is visible
      noteToDelete: null, // The note that is about to be deleted
    };
  }

  // Fetch notes from the backend
  componentDidMount() {
    fetch("http://localhost:3001/dashnotes") // Ensure the correct backend URL
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        // Create layout based on the fetched notes
        const newLayout = data.map((note) => ({
          i: note.i,
          x: note.x, // Default x position if not present
          y: note.y, // Default y position if not present
          w: note.w, // Default width if not present
          h: note.h, // Default height if not present
        }));
        this.setState({
          notes: data, // Update notes state
          layout: newLayout, // Update layout state based on the fetched notes
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the notes:", error); // Log any errors
      });
  }

  onLayoutChange = (layout) => {
    // Update notes with new positions and sizes from layout
    const updatedNotes = this.state.notes.map((note) => {
      const layoutItem = layout.find((item) => item.i === note.i);
      if (layoutItem) {
        fetch("http://localhost:3001/dashnotes/updatePos/" + note.i, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...layoutItem,
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          }),
        });
        return {
          ...note,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        };
      }
      return note;
    });

    this.setState({
      layout: layout,
      notes: updatedNotes,
    });
  };

  addNewNote = () => {
    const { newNote, notes, uploadedImage } = this.state;
    if (newNote.trim() !== "" || uploadedImage) {
      const newNoteObj = {
        i: `n${Date.now()}`, // Unique ID using timestamp
        content: newNote.trim(), // The content of the note
        x: 3, // Default pos
        y: 3, // Default pos
        w: 2, // Default width
        h: 2, // Default height
        image: uploadedImage ? uploadedImage : null, // If an image exists, associate it with the note
        color: "#ffffff", // Default text color
        showColorPicker: false, // Initially hide color picker
        backgroundColor: "#292929",
      };

      fetch("http://localhost:3001/dashnotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNoteObj),
      });

      this.setState((prevState) => ({
        notes: [...prevState.notes, newNoteObj],
        layout: [
          ...prevState.layout,
          {
            i: newNoteObj.i,
            x: newNoteObj.x,
            y: newNoteObj.y,
            w: newNoteObj.w,
            h: newNoteObj.h,
          },
        ],
        newNote: "", // Clear the input
        newImage: "", // Clear the image preview
        uploadedImage: null, // Clear the uploaded image
        showInput: false, // Hide input
      }));
    }
  };

  handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const formData = new FormData();
        formData.append("image", file);

        try {
          // Image upload to imgBB - limited.
          const apiKey = "fe619b58bd51b5c886a7692d838aa875";
          const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
              method: "POST",
              body: formData,
            }
          );

          const result = await response.json();

          if (result.success) {
            this.setState({
              newImage: result.data.url,
              uploadedImage: result.data.url, // Store the uploaded image URL
            });
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("An error occurred while uploading the image.");
        }
      }
    }
  };

  handleEditNote = (note) => {
    this.setState({
      editingNoteId: note.i, // Set the note being edited
      editedNoteText: note.content, // Load current note text for editing
      //TODO: EDIT IMAGE AND SAVE
    });
  };

  handleSaveEdit = (note) => {
    const { editedNoteText, editedNoteImage } = this.state;
    const updatedNotes = this.state.notes.map((n) =>
      n.i === note.i
        ? { ...n, content: editedNoteText, image: editedNoteImage }
        : n
    );

    fetch("http://localhost:3001/dashnotes/updateText/" + note.i, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ i: note.i, content: editedNoteText }),
    });

    this.setState({
      notes: updatedNotes,
      editingNoteId: null, // Reset editing mode
      editedNoteText: "", // Clear the edited text field
      //TODO: EDIT IMAGE AND SAVE
    });
  };

  handleDeleteClick = (note) => {
    this.setState({
      showDeleteModal: true, // Show the popup
      noteToDelete: note, // Set the note that is about to be deleted
    });
  };

  handleDoubleClick = (note) => {
    this.setState({
      editingNoteId: note.i, // Set the note being edited
      editedNoteText: note.content, // Load current note text for editing
    });
  };

  handleColorIconClick = (noteId) => {
    this.setState((prevState) => {
      const updatedNotes = prevState.notes.map((note) =>
        note.i === noteId
          ? { ...note, showColorPicker: !note.showColorPicker }
          : note
      );
      return { notes: updatedNotes };
    });
  };

  handleColorSelect = (noteId, color, textColor) => {
    this.setState((prevState) => {
      const updatedNotes = prevState.notes.map((note) =>
        note.i === noteId
          ? {
              ...note,
              backgroundColor: color,
              showColorPicker: false,
            }
          : note
      );
      return { notes: updatedNotes };
    });

    fetch("http://localhost:3001/dashnotes/updateColors/" + noteId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        i: noteId,
        backgroundColor: color,
        color: textColor,
      }),
    });
  };

  handleImageClick = (imageSrc) => {
    this.setState({
      isZoomed: true,
      zoomedImageSrc: imageSrc,
    });
  };

  confirmDeleteNote = () => {
    const { noteToDelete, notes } = this.state;
    const updatedNotes = notes.filter((n) => n.i !== noteToDelete.i); // Remove the note

    this.setState({
      notes: updatedNotes,
      showDeleteModal: false, // Hide the popup
      noteToDelete: null, // Clear the note to delete
    });

    console.log(noteToDelete.i);
    fetch("http://localhost:3001/dashnotes/" + noteToDelete.i, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  cancelDeleteNote = () => {
    this.setState({
      showDeleteModal: false, // Hide the popup
      noteToDelete: null, // Reset the note to delete
    });
  };

  handleCloseZoom = () => {
    this.setState({
      isZoomed: false,
      zoomedImageSrc: "",
    });
  };

  renderHeaderDash() {
    return <section className="dash-header">Dashboard</section>; //Title
  }

  renderNoteInput() {
    if (!this.state.showInput) return null;
    return (
      <div>
        <textarea
          value={this.state.newNote}
          onChange={(e) => this.setState({ newNote: e.target.value })}
          className="input-text"
          placeholder="Write a new note..."
        />

        <div className="upload-section">
          <label htmlFor="file-input" className="upload-image-button">
            <PhotographIcon className="upload-image" />
            <input
              type="file"
              id="file-input"
              onChange={this.handleImageUpload}
              className="hidden"
              accept="image/*" // Limit file types to images
            />
          </label>

          {this.state.newImage && (
            <div className="image-preview-container">
              <img
                src={this.state.newImage}
                alt="Preview"
                className="image-preview"
              />
            </div>
          )}
        </div>

        <button className="save-note-button" onClick={this.addNewNote}>
          Add Note
        </button>
      </div>
    );
  }

  renderAddNoteButton() {
    return (
      <button
        onClick={() => this.setState({ showInput: true })}
        className="dash-plus-button"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    );
  }

  renderEditButtons(note) {
    return (
      <div>
        <div className="edit-delete-buttons">
          {/* Edit Button */}
          {this.state.editingNoteId === note.i ? (
            <>
              <button
                onClick={() => this.handleSaveEdit(note)}
                className="save-button"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => this.handleEditNote(note)}
              className="edit-button"
            >
              <span className="icon">•••</span>
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => this.handleDeleteClick(note)}
            className="delete-button"
          >
            <span className="icon">🗑</span>
          </button>
        </div>

        {/* Select color button */}
        <button
          onClick={() => this.handleColorIconClick(note.i)}
          className="color-option-button1"
          style={{
            padding: "10px",
            background: "transparent",
          }}
        >
          <ColorSwatchIcon className="h-4 w-4 text-wheat-700" />
        </button>
      </div>
    );
  }

  renderColorPicker(note, textColor) {
    if (!note.showColorPicker) return null;
    const colorOptions = ["#ed5c53", "#84b6f4", "#77dd77", "#292929"]; // Pre-established colors, TODO: see better options
    return (
      <div className="color-options-menu">
        {colorOptions.map((color) => (
          <button
            key={color}
            onClick={() => this.handleColorSelect(note.i, color, textColor)}
            style={{
              backgroundColor: color,
            }}
            className="color-option-button"
          />
        ))}
      </div>
    );
  }

  renderDeleteConfirmation() {
    if (!this.state.showDeleteModal) return null;

    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <p>Are you sure you want to delete this note?</p>
          <button onClick={this.confirmDeleteNote} className="confirm-button">
            Confirm
          </button>
          <button onClick={this.cancelDeleteNote} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  renderZoomedImage() {
    if (!this.state.isZoomed) return null;
    return (
      <div className="zoom-image" onClick={this.handleCloseZoom}>
        <div className="zoom-content">
          <img
            src={this.state.zoomedImageSrc}
            alt="Zoomed"
            className="expanded-image"
          />
        </div>
      </div>
    );
  }

  generateDOM() {
    return this.state.notes.map((note) => {
      // Determine the text color based on the background color
      const textColor =
        note.backgroundColor === "#292929" ? "#ffffff" : "#1b1b1b";

      return (
        <div
          key={note.i}
          className="note"
          style={{
            backgroundColor: note.backgroundColor || "transparent", // Apply the background color here
            color: textColor, // Apply the dynamically selected text color
          }}
        >
          <div className="note-content">
            {note.image && (
              <img
                src={note.image}
                alt="Note"
                className="note-image"
                onClick={() => this.handleImageClick(note.image)} // Add onClick to zoom in on image click
                style={{ cursor: "zoom-in" }} // Change cursor to indicate click for zoom
              />
            )}
            {this.state.editingNoteId === note.i ? (
              <div
                contentEditable
                className="edit-text"
                onInput={(e) =>
                  this.setState({ editedNoteText: e.target.innerText })
                }
                onBlur={() => this.handleSaveEdit(note)}
                dangerouslySetInnerHTML={{
                  __html: note.content,
                }}
                style={{ color: textColor }}
              />
            ) : (
              <p
                className="text"
                style={{ color: textColor }} // Ensure the text color is applied
                onDoubleClick={() => this.handleDoubleClick(note)} // Allow editing on double-click
              >
                {note.content}
              </p>
            )}
            {this.renderEditButtons(note)}
          </div>
          {this.renderColorPicker(note, textColor)}
        </div>
      );
    });
  }

  render() {
    return (
      <>
        {this.renderHeaderDash()}
        {this.renderAddNoteButton()}
        {this.renderNoteInput()}
        {this.renderZoomedImage()}
        {this.renderDeleteConfirmation()}{" "}
        <ReactGridLayout
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
          isResizable={true}
          resizeHandles={["se"]}
          autoSize={true}
          preventCollision={false}
          useCSSTransforms={true}
        >
          {this.generateDOM()}
        </ReactGridLayout>
      </>
    );
  }
}
