// // src/components/VideoPrograms/CreateProgramModal.js
// import React, { useState } from "react";
// import {
//   uploadImageService,
//   createProgramService,
// } from "../../services/program.service";

// const CreateProgramModal = ({
//   isOpen,
//   onClose,
//   instructorOptions,
//   danceStyles,
// }) => {
//   if (!isOpen) return null;

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [danceStyle, setDanceStyle] = useState(danceStyles[0] || "");
//   const [danceLevel, setDanceLevel] = useState("Beginner");
//   const [pricingType, setPricingType] = useState("free");
//   const [price, setPrice] = useState(0);
//   const [instructorId, setInstructorId] = useState(""); // use IDs in real app
//   const [videos, setVideos] = useState([]);
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleCreateProgram = async () => {
//     try {
//       setLoading(true);
//       let uploadedImageUrl = "";
//       if (imageFile) {
//         uploadedImageUrl = await uploadImageService(imageFile);
//       }

//       const programPayload = {
//         title,
//         description,
//         dance_style: danceStyle,
//         dance_level: danceLevel,
//         pricing_type: pricingType,
//         price: pricingType === "paid" ? price : 0,
//         instructor_id: instructorId || 11, // fallback if you don't implement dropdown yet
//         videos: videos.length
//           ? videos
//           : [
//               // placeholder demo video
//               {
//                 title: "Sample Video",
//                 duration: "5:00",
//                 video_url: "https://example.com/sample.mp4",
//                 description: "Sample video description",
//               },
//             ],
//         image_url: uploadedImageUrl,
//       };

//       await createProgramService(programPayload);
//       alert("Program created successfully!");
//       onClose();
//     } catch (error) {
//       console.error("Error creating program:", error);
//       alert("Failed to create program.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <h2>Create Video Program</h2>
//         <label>Title:</label>
//         <input value={title} onChange={(e) => setTitle(e.target.value)} />

//         <label>Description:</label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <label>Dance Style:</label>
//         <select
//           value={danceStyle}
//           onChange={(e) => setDanceStyle(e.target.value)}
//         >
//           {danceStyles.map((style) => (
//             <option key={style} value={style}>
//               {style}
//             </option>
//           ))}
//         </select>

//         <label>Level:</label>
//         <select
//           value={danceLevel}
//           onChange={(e) => setDanceLevel(e.target.value)}
//         >
//           <option value="Beginner">Beginner</option>
//           <option value="Intermediate">Intermediate</option>
//           <option value="Advance">Advance</option>
//           <option value="Professional">Professional</option>
//         </select>

//         <label>Pricing Type:</label>
//         <select
//           value={pricingType}
//           onChange={(e) => setPricingType(e.target.value)}
//         >
//           <option value="free">Free</option>
//           <option value="paid">Paid</option>
//         </select>

//         {pricingType === "paid" && (
//           <>
//             <label>Price (₹):</label>
//             <input
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(Number(e.target.value))}
//             />
//           </>
//         )}

//         <label>Instructor:</label>
//         <select
//           value={instructorId}
//           onChange={(e) => setInstructorId(e.target.value)}
//         >
//           <option value="">Select Instructor</option>
//           {instructorOptions.map((inst, idx) => (
//             <option key={idx} value={11}>
//               {inst}
//             </option> // hardcoded id=11 for now
//           ))}
//         </select>

//         <label>Cover Image:</label>
//         <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
//         {imageFile && <p>Selected image: {imageFile.name}</p>}

//         {/* Optionally: add UI to add videos manually */}

//         <div className="modal-buttons">
//           <button onClick={handleCreateProgram} disabled={loading}>
//             {loading ? "Creating..." : "Create Program"}
//           </button>
//           <button onClick={onClose}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateProgramModal;
// src/components/VideoPrograms/CreateProgramModal.js
import React, { useState } from "react";
import {
  uploadImageService,
  createProgramService,
} from "../../services/program.service";

const CreateProgramModal = ({
  isOpen,
  onClose,
  instructorOptions,
  danceStyles,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [danceStyle, setDanceStyle] = useState(danceStyles[0] || "");
  const [danceLevel, setDanceLevel] = useState("Professional");
  const [pricingType, setPricingType] = useState("paid");
  const [price, setPrice] = useState(1399);
  const [instructorId, setInstructorId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([
    { title: "", duration: "", description: "", file: null },
  ]);

  const handleVideoChange = (index, field, value) => {
    const updated = [...videos];
    updated[index][field] = value;
    setVideos(updated);
  };

  const addVideo = () => {
    setVideos([
      ...videos,
      { title: "", duration: "", description: "", file: null },
    ]);
  };

  const removeVideo = (index) => {
    const updated = [...videos];
    updated.splice(index, 1);
    setVideos(updated);
  };

  const handleCreateProgram = async () => {
    try {
      setLoading(true);

      // 1️⃣ Upload cover image
      let uploadedImageUrl = "";
      if (imageFile) {
        const uploadRes = await uploadImageService(imageFile);
        uploadedImageUrl = uploadRes?.uploadResponse?.fileURL || "";
      }

      // 2️⃣ Upload each video or use fallback demo URLs
      const uploadedVideos = [];
      for (const video of videos.length
        ? videos
        : [
            {
              title: "Spot Turns with Control",
              duration: "9:20",
              description:
                "Learn how to execute clean, sharp spot turns with balance and grace.",
              video_url: "https://example.com/videos/salsa_spins.mp4",
            },
            {
              title: "Speed Drills",
              duration: "8:45",
              description:
                "Push your limits with fast-paced drills focused on timing, control, and acceleration.",
              video_url: "https://example.com/videos/salsa_speed_drills.mp4",
            },
          ]) {
        let videoUrl = video.video_url || "";
        if (video.file) {
          const uploadRes = await uploadImageService(video.file);
          videoUrl = uploadRes?.uploadResponse?.fileURL || "";
        }
        uploadedVideos.push({
          title: video.title,
          duration: video.duration,
          description: video.description,
          video_url: videoUrl,
        });
      }

      // 3️⃣ Build payload exactly matching Postman body
      const payload = {
        title,
        description,
        dance_style: danceStyle,
        dance_level: danceLevel,
        pricing_type: pricingType,
        price: pricingType === "paid" ? price : 0,
        instructor_id: Number(instructorId) || 11,
        videos: uploadedVideos,
        image_url: uploadedImageUrl,
      };

      console.log("🚀 Sending payload:", JSON.stringify(payload, null, 2));

      await createProgramService(payload);
      alert("✅ Program created successfully!");
      onClose();
    } catch (error) {
      console.error(
        "❌ Error creating program:",
        error?.response?.data || error
      );
      alert("Failed to create program.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create Video Program</h2>

        <label>Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Dance Style:</label>
        <select
          value={danceStyle}
          onChange={(e) => setDanceStyle(e.target.value)}
        >
          {danceStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>

        <label>Level:</label>
        <select
          value={danceLevel}
          onChange={(e) => setDanceLevel(e.target.value)}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advance">Advance</option>
          <option value="Professional">Professional</option>
        </select>

        <label>Pricing Type:</label>
        <select
          value={pricingType}
          onChange={(e) => setPricingType(e.target.value)}
        >
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        {pricingType === "paid" && (
          <>
            <label>Price (₹):</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </>
        )}

        <label>Instructor:</label>
        <select
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
        >
          <option value="">Select Instructor</option>
          {instructorOptions.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
        </select>

        <label>Cover Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        {imageFile && <p>Selected image: {imageFile.name}</p>}

        <h4>Videos:</h4>
        {videos.map((vid, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <input
              placeholder="Title"
              value={vid.title}
              onChange={(e) =>
                handleVideoChange(index, "title", e.target.value)
              }
            />
            <input
              placeholder="Duration (e.g. 9:20)"
              value={vid.duration}
              onChange={(e) =>
                handleVideoChange(index, "duration", e.target.value)
              }
            />
            <textarea
              placeholder="Description"
              value={vid.description}
              onChange={(e) =>
                handleVideoChange(index, "description", e.target.value)
              }
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                handleVideoChange(index, "file", e.target.files[0])
              }
            />
            <button type="button" onClick={() => removeVideo(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addVideo}>
          + Add Video
        </button>

        <div className="modal-buttons">
          <button onClick={handleCreateProgram} disabled={loading}>
            {loading ? "Creating..." : "Create Program"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProgramModal;
