import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import state from "../store";
import { DecalTypes, EditorTabs, FilterTabs } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import Tab from "../components/Tab";
import CustomButton from "../components/CustomButton";
import ColorPicker from "../components/ColorPicker";
import FilePicker from "../components/FilePicker";
import AIPicker from "../components/AIPicker";
import { getBase64ImageFromUrl, reader } from "../config/helpers";

function Customizer() {
  const snap = useSnapshot(state);

  const [file, setFile] = useState<File>(new File([], ""));
  const [prompt, setPrompt] = useState<string>("");
  const [generatingImg, setGeneratingImg] = useState<boolean>(false);
  const [activeEditorTab, setActiveEditorTab] = useState<string>("");
  const [activeFilterTab, setActiveFilterTab] = useState<{
    logoShirt: boolean;
    stylishShirt: boolean;
  }>({
    logoShirt: true,
    stylishShirt: false,
  });

  // show tab content depending on the activeTab
  function generateTabContent() {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  }

  async function handleSubmit(type: string) {
    if (!prompt) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);

      const response = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      // const photo = getBase64ImageFromUrl(data);
      console.log(data);
      handleDecals(type, `data:image/jpg;base64,${data}`);
    } catch (error) {
      alert(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  function handleDecals(type: string, result: string) {
    const decalType: {
      stateProperty: string;
      filterTab: string;
    } = DecalTypes[type as keyof typeof DecalTypes];
    (state as any)[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab as keyof typeof activeFilterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  }

  function handleActiveFilterTab(tabName: string) {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
    }

    // after setting the state, active

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName as keyof typeof prevState],
      };
    });
  }

  function readFile(type: any) {
    reader(file).then((result: any) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => {
                      setActiveEditorTab(tab.name);
                    }}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab: { name: string; icon: string }) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={
                  activeFilterTab[tab.name as keyof typeof activeFilterTab]
                }
                handleClick={() => {
                  handleActiveFilterTab(tab.name);
                }}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Customizer;
