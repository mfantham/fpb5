import Button from "./Button";

const takeScreenshot = () => {
  const canvas = document.querySelector("canvas"); // very unreactful :( useThree() ? nop. not in canvas. move to canvas?
  const link = document.createElement("a");
  link.download = "screenshot.png";

  canvas.toBlob((blob) => {
    const screenshotUrl = URL.createObjectURL(blob);
    link.href = screenshotUrl;
    link.click();
    URL.revokeObjectURL(screenshotUrl);
  }, "image/png");
};

const Screenshot = () => {
  return <Button onClick={() => takeScreenshot()}>Screenshot</Button>;
};

export default Screenshot;
