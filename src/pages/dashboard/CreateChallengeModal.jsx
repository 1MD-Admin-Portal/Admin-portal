// import React, { useState } from "react";
// import "../../styles/CreateChallengeModal.css";

// const CreateChallengeModal = ({ onClose }) => {
//   const [taskGroups, setTaskGroups] = useState([
//     {
//       watchVideos: [{ id: Date.now(), title: "" }],
//       uploadVideos: [{ id: Date.now() + 1, title: "", file: null }],
//     },
//   ]);

//   const handleWatchTitleChange = (groupIndex, watchIndex, value) => {
//     const updatedGroups = [...taskGroups];
//     updatedGroups[groupIndex].watchVideos[watchIndex].title = value;
//     setTaskGroups(updatedGroups);
//   };

//   const handleUploadTitleChange = (groupIndex, uploadIndex, value) => {
//     const updatedGroups = [...taskGroups];
//     updatedGroups[groupIndex].uploadVideos[uploadIndex].title = value;
//     setTaskGroups(updatedGroups);
//   };

//   const handleUploadFileChange = (groupIndex, uploadIndex, file) => {
//     const updatedGroups = [...taskGroups];
//     updatedGroups[groupIndex].uploadVideos[uploadIndex].file = file;
//     setTaskGroups(updatedGroups);
//   };

//   const addWatchVideo = (groupIndex) => {
//     const updatedGroups = [...taskGroups];
//     updatedGroups[groupIndex].watchVideos.push({ id: Date.now(), title: "" });
//     setTaskGroups(updatedGroups);
//   };

//   const addUploadVideo = (groupIndex) => {
//     const updatedGroups = [...taskGroups];
//     updatedGroups[groupIndex].uploadVideos.push({
//       id: Date.now(),
//       title: "",
//       file: null,
//     });
//     setTaskGroups(updatedGroups);
//   };

//   const addTaskGroup = () => {
//     setTaskGroups([
//       ...taskGroups,
//       {
//         watchVideos: [{ id: Date.now(), title: "" }],
//         uploadVideos: [{ id: Date.now() + 1, title: "", file: null }],
//       },
//     ]);
//   };

//   const removeWatchVideo = (groupIndex, watchIndex) => {
//     const updatedGroups = [...taskGroups];
//     updatedGroups[groupIndex].watchVideos.splice(watchIndex, 1);
//     setTaskGroups(updatedGroups);
//   };

//   const removeUploadVideo = (groupIndex, uploadIndex) => {
//     const updatedGroups = [...taskGroups];
//     updatedGroups[groupIndex].uploadVideos.splice(uploadIndex, 1);
//     setTaskGroups(updatedGroups);
//   };

//   return (
//     <div className="create-challenge-modal">
//       <div className="modal-content-challenge">
//         <div className="modal-header">
//           <span onClick={onClose} className="back-button">← Back</span>
//           <h2>Create New Challenge</h2>
//         </div>

//         <div className="modal-body">
//           <div className="form-group">
//             <label>Challenge Title</label>
//             <input type="text" placeholder="Challenge" />
//           </div>

//           {/* <div className="form-group">
//             <label>Challenger Type</label>
//             <select>
//               <option>Public</option>
//               <option>Private</option>
//             </select>
//           </div> */}

//           <div className="form-group">
//             <label>Description</label>
//             <textarea placeholder="Description" />
//           </div>

//           <div className="form-group">
//             <label>Upload Image</label>
//             <input type="file" accept="image/*" />
//           </div>

//           <div className="form-group">
//             <label>Dance Style</label>
//             <select>
//               <option>Salsa</option>
//               <option>Bachata</option>
//               <option>Kizomba</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label>Dance Level</label>
//             <select>
//               <option>Beginner</option>
//               <option>Intermediate</option>
//               <option>Advance</option>
//             </select>
//           </div>

//           {/* Challenge Tasks */}
//           <div className="task-section">
//             <h4>Challenge Tasks</h4>

//             {taskGroups.map((group, groupIndex) => (
//               <div key={groupIndex} className="task-group">
//                 <h5>Task Group {groupIndex + 1}</h5>

//                 {/* Watch Videos */}
//                 {group.watchVideos.map((watch, watchIndex) => (
//                   <div key={watch.id} className="task-row watch-upload-row">
//                     <span className="task-type">+ Watch Video</span>
//                     <input
//                       type="text"
//                       placeholder="Video Title"
//                       value={watch.title}
//                       onChange={(e) =>
//                         handleWatchTitleChange(groupIndex, watchIndex, e.target.value)
//                       }
//                     />
//                     <button className="insert-btn">Insert Video</button>
//                     <button
//                       className="remove-task-btn"
//                       onClick={() => removeWatchVideo(groupIndex, watchIndex)}
//                     >
//                       ❌
//                     </button>
//                   </div>
//                 ))}

//                 <button className="add-task-btn" onClick={() => addWatchVideo(groupIndex)}>
//                   + Add Watch Video
//                 </button>

//                 {/* Upload Videos */}
//                 {group.uploadVideos.map((upload, uploadIndex) => (
//                   <div key={upload.id} className="task-row watch-upload-row">
//                     <span className="task-type">Upload Video</span>
//                     <input
//                       type="text"
//                       placeholder="Upload Title"
//                       value={upload.title}
//                       onChange={(e) =>
//                         handleUploadTitleChange(groupIndex, uploadIndex, e.target.value)
//                       }
//                     />
//                     <input
//                       type="file"
//                       accept="video/*"
//                       onChange={(e) =>
//                         handleUploadFileChange(groupIndex, uploadIndex, e.target.files[0])
//                       }
//                     />
//                     <button
//                       className="remove-task-btn"
//                       onClick={() => removeUploadVideo(groupIndex, uploadIndex)}
//                     >
//                       ❌
//                     </button>
//                   </div>
//                 ))}

//                 <button className="add-task-btn" onClick={() => addUploadVideo(groupIndex)}>
//                   + Add Upload Video
//                 </button>

//                 <hr />
//               </div>
//             ))}

//             {/* Add Group Button */}
//             <button className="add-task-btn" onClick={addTaskGroup}>
//               + Add New Task Group
//             </button>
//           </div>
//         </div>

//         <div className="modal-footer">
//           <button className="cancel-btn" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="publish-btn">Publish Challenge</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateChallengeModal;

import React, { useState } from "react";
import "../../styles/CreateChallengeModal.css";
import { createChallengeService } from "../../services/challenge.service";

const CreateChallengeModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [challengerType, setChallengerType] = useState("public");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [danceStyle, setDanceStyle] = useState("Salsa");
  const [danceLevel, setDanceLevel] = useState("Beginner");

  const [taskGroups, setTaskGroups] = useState([
    {
      watchVideos: [{ id: Date.now(), title: "" }],
      uploadVideos: [{ id: Date.now() + 1, title: "", file: null }],
    },
  ]);

  const handleWatchTitleChange = (groupIndex, watchIndex, value) => {
    const updatedGroups = [...taskGroups];
    updatedGroups[groupIndex].watchVideos[watchIndex].title = value;
    setTaskGroups(updatedGroups);
  };

  const handleUploadTitleChange = (groupIndex, uploadIndex, value) => {
    const updatedGroups = [...taskGroups];
    updatedGroups[groupIndex].uploadVideos[uploadIndex].title = value;
    setTaskGroups(updatedGroups);
  };

  const handleUploadFileChange = (groupIndex, uploadIndex, file) => {
    const updatedGroups = [...taskGroups];
    updatedGroups[groupIndex].uploadVideos[uploadIndex].file = file;
    setTaskGroups(updatedGroups);
  };

  const addWatchVideo = (groupIndex) => {
    const updatedGroups = [...taskGroups];
    updatedGroups[groupIndex].watchVideos.push({ id: Date.now(), title: "" });
    setTaskGroups(updatedGroups);
  };

  const addUploadVideo = (groupIndex) => {
    const updatedGroups = [...taskGroups];
    updatedGroups[groupIndex].uploadVideos.push({ id: Date.now(), title: "", file: null });
    setTaskGroups(updatedGroups);
  };

  const addTaskGroup = () => {
    setTaskGroups([
      ...taskGroups,
      {
        watchVideos: [{ id: Date.now(), title: "" }],
        uploadVideos: [{ id: Date.now() + 1, title: "", file: null }],
      },
    ]);
  };

  const removeWatchVideo = (groupIndex, watchIndex) => {
    const updatedGroups = [...taskGroups];
    updatedGroups[groupIndex].watchVideos.splice(watchIndex, 1);
    setTaskGroups(updatedGroups);
  };

  const removeUploadVideo = (groupIndex, uploadIndex) => {
    const updatedGroups = [...taskGroups];
    updatedGroups[groupIndex].uploadVideos.splice(uploadIndex, 1);
    setTaskGroups(updatedGroups);
  };

  const handleSubmit = async () => {
    const tasks = [];

    taskGroups.forEach(group => {
      group.watchVideos.forEach(watch => {
        if (watch.title.trim()) {
          tasks.push({
            task_type: "watch_video",
            task_title: watch.title,
            video_url: "https://cdn.example.com/videos/intro.mp4" // placeholder or upload handling
          });
        }
      });

      group.uploadVideos.forEach(upload => {
        if (upload.title.trim()) {
          tasks.push({
            task_type: "upload_video",
            task_title: upload.title
            // You can later handle actual upload
          });
        }
      });
    });

    const challengeData = {
      title,
      challenger_type: challengerType,
      description,
      image_url: imageUrl,
      dance_style: danceStyle,
      dance_level: danceLevel,
      tasks
    };

    try {
      await createChallengeService(challengeData);
      alert("Challenge created successfully!");
      onClose();
    } catch (error) {
      alert("Error creating challenge.");
    }
  };

  return (
    <div className="create-challenge-modal">
      <div className="modal-content-challenge">
        <div className="modal-header">
          <span onClick={onClose} className="back-button">← Back</span>
          <h2>Create New Challenge</h2>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Challenge Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Dance Style</label>
            <select value={danceStyle} onChange={(e) => setDanceStyle(e.target.value)}>
              <option>Salsa</option>
              <option>Bachata</option>
              <option>Kizomba</option>
            </select>
          </div>

          <div className="form-group">
            <label>Dance Level</label>
            <select value={danceLevel} onChange={(e) => setDanceLevel(e.target.value)}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advance</option>
            </select>
          </div>

          {/* Challenge Tasks */}
          <div className="task-section">
            <h4>Challenge Tasks</h4>
            {taskGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="task-group">
                <h5>Task Group {groupIndex + 1}</h5>

                {group.watchVideos.map((watch, watchIndex) => (
                  <div key={watch.id} className="task-row watch-upload-row">
                    <span className="task-type">+ Watch Video</span>
                    <input
                      type="text"
                      placeholder="Video Title"
                      value={watch.title}
                      onChange={(e) => handleWatchTitleChange(groupIndex, watchIndex, e.target.value)}
                    />
                    <button className="remove-task-btn" onClick={() => removeWatchVideo(groupIndex, watchIndex)}>❌</button>
                  </div>
                ))}
                <button className="add-task-btn" onClick={() => addWatchVideo(groupIndex)}>+ Add Watch Video</button>

                {group.uploadVideos.map((upload, uploadIndex) => (
                  <div key={upload.id} className="task-row watch-upload-row">
                    <span className="task-type">Upload Video</span>
                    <input
                      type="text"
                      placeholder="Upload Title"
                      value={upload.title}
                      onChange={(e) => handleUploadTitleChange(groupIndex, uploadIndex, e.target.value)}
                    />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleUploadFileChange(groupIndex, uploadIndex, e.target.files[0])}
                    />
                    <button className="remove-task-btn" onClick={() => removeUploadVideo(groupIndex, uploadIndex)}>❌</button>
                  </div>
                ))}
                <button className="add-task-btn" onClick={() => addUploadVideo(groupIndex)}>+ Add Upload Video</button>
                <hr />
              </div>
            ))}
            <button className="add-task-btn" onClick={addTaskGroup}>+ Add New Task Group</button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="publish-btn" onClick={handleSubmit}>Publish Challenge</button>
        </div>
      </div>
    </div>
  );
};

export default CreateChallengeModal;
