import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { formsService } from 'services';

export default function Catalogue() {
    const [forms, setForms] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = () => {
        formsService.getAll()
            .then((response) => {
                if (response && response.forms && Array.isArray(response.forms)) {
                    setForms(response.forms);
                } else {
                    setError("No forms available or unexpected response format");
                }
            })
            .catch(error => {
                setError("Failed to fetch forms. Please try again later.");
            });
    };

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            fetchForms();
        } else {
            const filteredForms = forms.filter(form => form.name.toLowerCase().includes(searchTerm.toLowerCase()));
            if (filteredForms.length > 0) {
                setForms(filteredForms);
                setError(null);
            } else {
                setError(`No forms found with name '${searchTerm}'`);
                setForms([]);
            }
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
        fetchForms();
    };

    return (
        <div className="container-fluid p-0">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid d-flex justify-content-center align-items-center">
                    <h2 className="navbar-brand m-0">View Form</h2>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="btn-close btn-close-white"></span>
                    </button>
                </div>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button type="button" className="btn-close btn-close-white" aria-label="Close"></button>
                        </li>
                    </ul>
                </div>
            </nav>

            <br/>
            <div className="container d-flex flex-column align-items-center" style={{ minHeight: "100vh", paddingTop: "70px" }}>
                <div className="input-group mb-3">
                    <button className="btn btn-outline-success me-2" type="button" onClick={handleSearch}>Search Form</button>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Enter the name of the form you want to find"
                        aria-label="Enter the name of the form you want to find"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="btn btn-outline-secondary" type="button" onClick={clearSearch}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    )}
                </div>

                <br/>

                {error && <div className="alert alert-danger">{error}</div>}

                {forms.length === 0 && !error && (
                    <div className="alert alert-info">No forms available.</div>
                )}

                {forms.map((form) => (
                    <React.Fragment key={form.id}>
                        <button type="button" className="card text-center border border-dark w-50 p-3">
                            <div className="card-body py-4">
                                <p className="mb-0 pb-1 border-bottom border-dark">{form.name}</p>
                                <br/>
                            </div>
                        </button>
                        <br/>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}