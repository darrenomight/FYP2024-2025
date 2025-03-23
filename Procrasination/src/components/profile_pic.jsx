import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import userProfile from "../assets/sampleUserPf.jpg"; 

const ProfilePicLink = () => {
    const [url, setUrl] = useState("");
    const [preview, setPreview] = useState("");

    const handleSave = async () => {
        if (!auth.currentUser || !url) return;
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
            profilePic: url,
        });
        alert("Profile picture link updated!");
    };

    return (
        <div className="card p-3">
            <label>Paste Image URL:</label>
            <input
                type="text"
                className="form-control"
                value={url}
                onChange={(e) => {
                    setUrl(e.target.value);
                    setPreview(e.target.value);
                }}
                placeholder="userProfile"
            />
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="mt-3 rounded-circle"
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                />
            )}
            <button className="btn btn-success mt-2" onClick={handleSave}>
                Save Image
            </button>
        </div>
    );
};

export default ProfilePicLink;
