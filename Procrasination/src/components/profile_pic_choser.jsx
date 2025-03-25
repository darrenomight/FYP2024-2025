import React, { useRef, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const ProfilePictureUploader = () => {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        setUploading(true);
        setError("");

        try {
            const resizedBase64 = await resizeAndConvertToBase64(file);

            console.log("✅ Base64 size:", resizedBase64.length);

            // 🚨 Check size (900KB limit for safety)
            if (resizedBase64.length > 900000) {
                setError("Image is still too large after resizing. Please try a smaller image.");
                setUploading(false);
                return;
            }

            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    profilePic: resizedBase64,
                });

                // Refresh to show new pic

                setTimeout(() => {
                    navigate("/main", { replace: true });
                }, 1000);

            }
        } catch (err) {
            setError("Failed to upload image.");
            console.error("❌ Upload error:", err);
        }

        setUploading(false);
    };

    const resizeAndConvertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const maxSize = 200;

                    const scale = Math.min(maxSize / img.width, maxSize / img.height);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const base64 = canvas.toDataURL("image/jpeg", 0.9); 
                    resolve(base64);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="mt-3">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageUpload}
            />
            <button
                className="btn btn-outline-primary w-100"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Update Profile Picture"}
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
        </div>
    );
};

export default ProfilePictureUploader;
