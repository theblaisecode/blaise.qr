"use strict";

window.addEventListener("DOMContentLoaded", function () {
  // -------------------- Get text/url value from input
  const data = document.querySelector("#data");

  // -------------------- Background Color
  const bgCode = document.querySelector("#bgCode");
  const bgColor = document.querySelector("#bgColor");
  const gradientCheckbox = document.querySelector("#gradient");
  const transparentCheckbox = document.querySelector("#transparent");
  const bgGradientSelection = document.querySelector("#bgGradientSelection");
  // -------------------- Gradient Background color
  const gradientBgCode = document.querySelector("#gradientBgCode");
  const gradientBgColor = document.querySelector("#gradientBgColor");
  // -------------------- Rotation for gradient background
  const bgGradientRotationInput = document.querySelector("#bgGradientRotation");

  // -------------------- Dot color
  const dotCode = document.querySelector("#dotCode");
  const dotColor = document.querySelector("#dotColor");

  // -------------------- Marker color
  const markerCode = document.querySelector("#markerCode");
  const markerColor = document.querySelector("#markerColor");

  // -------------------- Marker Center color
  const markerCenterCode = document.querySelector("#markerCenterCode");
  const markerCenterColor = document.querySelector("#markerCenterColor");

  // -------------------- Size
  const size = document.querySelector("#size");
  const qrSize = document.querySelector("#qrSize");

  // -------------------- Logo
  const logo = document.querySelector("#fileInput");
  const removeLogoButton = document.querySelector("#removeLogo");

  // -------------------- Download Buttons
  const downloadPNG = document.querySelector("#downloadPNG");
  const downloadJPG = document.querySelector("#downloadJPG");
  const downloadSVG = document.querySelector("#downloadSVG");
  const downloadWEBP = document.querySelector("#downloadWEBP");

  // -------------------- QR Code
  const qrCode = new QRCodeStyling({
    width: 250,
    height: 250,
    data: "https://linktr.ee/theblaisecode",
    image: "",
    dotsOptions: { color: "#000", type: "square" },
    backgroundOptions: {
      color: "#fff",
      gradient: gradientCheckbox.checked
        ? {
            type: "linear",
            colorStops: [
              { offset: 0, color: "#000" },
              { offset: 1, color: bgColor.value.trim() },
            ],
          }
        : null,
    },
    cornersSquareOptions: { color: "#000", type: "" },
    cornersDotOptions: { color: "#000", type: "" },
    imageOptions: { imageSize: 0.4, crossOrigin: "anonymous", margin: 7 },
  });

  // -------------------- Change QR Code data
  data.addEventListener("input", () => {
    const newData = data.value;
    qrCode.update({ data: newData });
  });

  // -------------------- Use #fff or #ffffff to get the same result
  function transformColorCode(colorCode) {
    if (colorCode.length === 4 && colorCode[0] === "#") {
      return `#${colorCode[1]}${colorCode[1]}${colorCode[2]}${colorCode[2]}${colorCode[3]}${colorCode[3]}`;
    } else if (colorCode.length === 7 && colorCode[0] === "#") {
      return `#${colorCode.substring(1)}`;
    }
    return colorCode;
  }

  // -------------------- Change Background Gradient
  function updateGradientBackground(options) {
    const bgColorValue = bgCode.value.trim();
    const gradientBgColorValue = options.color.trim();
    const rotation = options.rotation;

    qrCode.update({
      backgroundOptions: {
        gradient: {
          type: "linear",
          rotation: rotation,
          colorStops: [
            { offset: 0, color: bgColorValue },
            { offset: 1, color: gradientBgColorValue },
          ],
        },
      },
    });
  }

  let gradientBgRotationValue = 0; // Initialize with a default value

  // -------------------- Update QR code background
  function updateQRCodeBackground() {
    const bgColorValue = bgCode.value.trim();
    const gradientBgColorValue = gradientBgCode.value.trim();

    if (gradientCheckbox.checked) {
      qrCode.update({
        backgroundOptions: {
          color: "#000", // Default color for gradient
          gradient: {
            type: "linear",
            rotation: gradientBgRotationValue + "deg",
            colorStops: [
              { offset: 0, color: bgColorValue },
              { offset: 1, color: gradientBgColorValue },
            ],
          },
        },
      });
    } else {
      qrCode.update({
        backgroundOptions: {
          color: bgColorValue,
          gradient: null,
        },
      });
    }
  }

  // -------------------- Change Background color code
  function handleBgCodeInput() {
    let newBgCode = bgCode.value.trim();
    newBgCode = transformColorCode(newBgCode);
    bgColor.value = newBgCode;

    if (gradientCheckbox.checked) {
      updateQRCodeBackground();
    } else {
      qrCode.update({
        backgroundOptions: {
          color: newBgCode,
          gradient: null,
        },
      });
    }
  }

  bgCode.addEventListener("input", handleBgCodeInput);

  // -------------------- Change Background color
  bgColor.addEventListener("input", () => {
    const newBgColor = bgColor.value;
    bgCode.value = newBgColor;

    if (gradientCheckbox.checked) {
      updateQRCodeBackground();
    } else {
      qrCode.update({ backgroundOptions: { color: newBgColor } });
    }
  });

  // -------------------- Change Background Transparency
  function handleTransparentCheckboxChange() {
    const isTransparent = transparentCheckbox.checked;
    const bgColorValue = isTransparent ? "#ffffff00" : bgCode.value;

    if (gradientCheckbox.checked && isTransparent) {
      gradientCheckbox.checked = false; // Turn off gradient if transparent is on
      bgGradientSelection.style.display = "none"; // Hide gradient style
      qrCode.update({
        backgroundOptions: { color: bgColorValue, gradient: null },
      });
    } else {
      qrCode.update({
        backgroundOptions: { color: bgColorValue, gradient: null },
      });
    }
  }
  transparentCheckbox.addEventListener(
    "change",
    handleTransparentCheckboxChange
  );

  // -------------------- Toggle Background Gradient
  gradientCheckbox.addEventListener("change", () => {
    bgGradientSelection.style.display = gradientCheckbox.checked
      ? "flex"
      : "none";

    if (transparentCheckbox.checked && gradientCheckbox.checked) {
      transparentCheckbox.checked = false;
      qrCode.update({
        backgroundOptions: { color: bgCode.value.trim(), gradient: null },
      });
    }

    if (gradientCheckbox.checked) {
      const bgColorValue = bgCode.value.trim();
      const gradientBgColorValue = gradientBgCode.value.trim();
      const defaultGradient = gradientBgColorValue || "#000";

      qrCode.update({
        backgroundOptions: {
          color: "#000",
          gradient: {
            type: "linear",
            rotation: "0deg",
            colorStops: [
              { offset: 0, color: bgColorValue },
              { offset: 1, color: defaultGradient },
            ],
          },
        },
      });

      // -------------------- Call updateGradientBackground to immediatly update gradient
      updateGradientBackground({
        color: gradientBgColorValue,
        rotation: gradientBgRotationValue + "deg",
      });
    } else {
      const bgColorValue = bgColor.value.trim();
      qrCode.update({
        backgroundOptions: {
          color: bgColorValue,
          gradient: null,
        },
      });
    }
  });

  // -------------------- Change Gradient Background code
  function handleGradientBgCodeInput() {
    let newGradientBgCode = gradientBgCode.value.trim();
    newGradientBgCode = transformColorCode(newGradientBgCode);

    gradientBgColor.value = newGradientBgCode;

    // -------------------- Use the set rotation value to update QR code background
    if (gradientCheckbox.checked) {
      qrCode.update({
        backgroundOptions: {
          gradient: {
            type: "linear",
            rotation: gradientBgRotationValue + "deg",
            colorStops: [
              { offset: 0, color: bgCode.value.trim() },
              { offset: 1, color: newGradientBgCode },
            ],
          },
        },
      });
    }
  }

  gradientBgCode.addEventListener("input", handleGradientBgCodeInput);

  // -------------------- Change Gradient Background Color
  gradientBgColor.addEventListener("input", () => {
    const newGradientBgColor = gradientBgColor.value;
    gradientBgCode.value = newGradientBgColor;

    if (gradientCheckbox.checked) {
      const bgColorValue = bgCode.value.trim();
      const gradientBgColorValue = newGradientBgColor.trim();
      qrCode.update({
        backgroundOptions: {
          gradient: {
            type: "linear",
            rotation: gradientBgRotationValue + "deg",
            colorStops: [
              { offset: 0, color: bgColorValue },
              { offset: 1, color: gradientBgColorValue },
            ],
          },
        },
      });
    } else {
      // If the gradient not checked, revert color to background color
      qrCode.update({ backgroundOptions: { color: newGradientBgColor } });
    }
  });

  // -------------------- Change Gradient Background Direction
  bgGradientRotationInput.addEventListener("input", () => {
    gradientBgRotationValue = parseInt(bgGradientRotationInput.value, 10);

    // -------------------- Make rotation not exceed 360 degrees
    if (gradientBgRotationValue > 360) {
      gradientBgRotationValue = 360;
      bgGradientRotationInput.value = gradientBgRotationValue;
    }

    if (gradientCheckbox.checked) {
      const bgColorValue = bgCode.value.trim();
      const gradientBgColorValue = gradientBgCode.value.trim();

      // -------------------- Convert degrees to radians else the rotation doesnt work properly
      const rotationInRadians = (gradientBgRotationValue * Math.PI) / 180;

      qrCode.update({
        backgroundOptions: {
          gradient: {
            type: "linear",
            rotation: rotationInRadians,
            colorStops: [
              { offset: 0, color: bgColorValue },
              { offset: 1, color: gradientBgColorValue },
            ],
          },
        },
      });
    }
  });

  // -------------------- Dot Color
  function handleDotCodeInput() {
    let newDotCode = dotCode.value.trim();
    newDotCode = transformColorCode(newDotCode);
    dotColor.value = newDotCode;

    qrCode.update({
      dotsOptions: {
        color: newDotCode,
      },
    });
  }

  dotCode.addEventListener("input", handleDotCodeInput);

  dotColor.addEventListener("input", () => {
    const newDotColor = dotColor.value.trim();
    qrCode.update({
      dotsOptions: {
        color: newDotColor,
      },
    });

    dotCode.value = newDotColor;
  });

  // -------------------- Marker Color
  function handleMarkerCodeInput() {
    let newMarkerCode = markerCode.value.trim();
    newMarkerCode = transformColorCode(newMarkerCode);
    markerColor.value = newMarkerCode;

    qrCode.update({
      cornersSquareOptions: {
        color: newMarkerCode,
      },
    });
  }

  markerCode.addEventListener("input", handleMarkerCodeInput);

  markerColor.addEventListener("input", () => {
    const newMarkerColor = markerColor.value.trim();
    qrCode.update({
      cornersSquareOptions: {
        color: newMarkerColor,
      },
    });

    markerCode.value = newMarkerColor;
  });

  // -------------------- Marker Center Color
  function handleMarkerCenterCodeInput() {
    let newMarkerCenterCode = markerCenterCode.value.trim();
    newMarkerCenterCode = transformColorCode(newMarkerCenterCode);
    markerCenterColor.value = newMarkerCenterCode;

    qrCode.update({
      cornersDotOptions: {
        color: newMarkerCenterCode,
      },
    });
  }

  markerCenterCode.addEventListener("input", handleMarkerCenterCodeInput);

  markerCenterColor.addEventListener("input", () => {
    const newMarkerCenterColor = markerCenterColor.value.trim();
    qrCode.update({
      cornersDotOptions: {
        color: newMarkerCenterColor,
      },
    });

    markerCenterCode.value = newMarkerCenterColor;
  });

  // -------------------- Size to download the generated qrcode
  qrSize.innerText = `${size.value} x ${size.value} px`;

  let newSize = size.value;
  size.onchange = function () {
    qrSize.value = this.value;
    qrSize.innerText = `${this.value} x ${this.value} px`;
    newSize = this.value;
  };

  // -------------------- Dot Style
  const dotTypes = [
    "square1",
    "dots1",
    "rounded1",
    "extra-rounded1",
    "classy1",
    "classy-rounded1",
  ];

  dotTypes.forEach((id) => {
    const dotElement = document.getElementById(id);

    dotElement.addEventListener("click", () => {
      const updatedDot = id.replace(/[0-9]/g, "");
      qrCode.update({
        dotsOptions: {
          type: updatedDot,
        },
      });
    });
  });

  // -------------------- Marker Style
  const markerTypes = ["square2", "dot2", "extra-rounded2", "2"];

  markerTypes.forEach((type) => {
    const markerElement = document.getElementById(type);

    markerElement.addEventListener("click", () => {
      const updatedType = type.replace(/[0-9]/g, "");

      console.log("Marker Style Clicked:", type, "Updated Type:", updatedType);

      qrCode.update({
        cornersSquareOptions: {
          type: updatedType !== "" ? updatedType : null,
        },
      });
    });
  });

  // -------------------- Marker Center Style
  const markerCenterStyleTypes = ["square3", "dot3", "3"];

  markerCenterStyleTypes.forEach((id) => {
    const markerCenterStyleElement = document.getElementById(id);

    if (markerCenterStyleElement) {
      markerCenterStyleElement.addEventListener("click", () => {
        const updatedMarkerCenterStyleType = id.replace(/[0-9]/g, "");

        console.log(
          "Marker Center Style Clicked:",
          id,
          "Updated Type:",
          updatedMarkerCenterStyleType
        );

        qrCode.update({
          cornersDotOptions: {
            type:
              updatedMarkerCenterStyleType !== ""
                ? updatedMarkerCenterStyleType
                : null,
          },
        });
      });
    }
  });

  // -------------------- Logo Style
  logo.addEventListener("change", () => {
    const newImage = URL.createObjectURL(logo.files[0]);
    qrCode.update({ image: newImage });
  });

  const loadFile = function (event) {
    const input = event.target;
    const file = input.files[0];
    const output = document.getElementById("preview_img");

    const reader = new FileReader();
    reader.onload = function () {
      output.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", loadFile);

  // -------------------- Remove Logo
  removeLogoButton.addEventListener("click", () => {
    qrCode.update({ image: "" });
    document.getElementById("fileInput").value = null;
    document.getElementById("preview_img").src = "./img/img placeholder.jpg";
  });

  // -------------------- Download Format
  function downloadQRCode(format) {
    const canvas = document.getElementById("canvas").firstChild;
    const newCanvas = document.createElement("canvas");
    newCanvas.width = newSize;
    newCanvas.height = newSize;

    const context = newCanvas.getContext("2d");
    context.drawImage(canvas, 0, 0, newSize, newSize);

    const dataURL = newCanvas.toDataURL(`image/${format}`);
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `qrcode.${format}`;
    link.click();
  }

  downloadPNG.addEventListener("click", () => downloadQRCode("png"));
  downloadJPG.addEventListener("click", () => downloadQRCode("jpeg"));
  downloadSVG.addEventListener("click", () => downloadQRCode("svg+xml"));
  downloadWEBP.addEventListener("click", () => downloadQRCode("webp"));

  // -------------------- Append QR to the Dom
  qrCode.append(document.getElementById("canvas"));
});
