import { UCDAVIS_COLORS } from './colors';
  
  export const studentPopulationData = {
    categories: [
      { name: "Undergraduate", value: 32273, color: UCDAVIS_COLORS.primary },
      { name: "Graduate Academic", value: 4621, color: UCDAVIS_COLORS.secondary },
      { name: "Health Science Prof", value: 2401, color: UCDAVIS_COLORS.accent2 },
      { name: "General Campus Prof", value: 750, color: UCDAVIS_COLORS.accent1 },
      { name: "Post-Baccalaureate", value: 69, color: UCDAVIS_COLORS.accent3 },
      { name: "Self-Supporting", value: 1126, color: "#8884d8" },
    ],
    undergradByYear: [
      { name: "Freshman", students: 5946, color: "#8884d8" },
      { name: "Sophomore", students: 6295, color: "#82ca9d" },
      { name: "Junior", students: 8572, color: "#ffc658" },
      { name: "Senior", students: 11460, color: "#ff8042" },
    ],
    undergradByCollege: [
      { name: "CLAS", students: 13182, color: "#8884d8" },
      { name: "CA&ES", students: 7643, color: "#82ca9d" },
      { name: "CBS", students: 6487, color: "#ffc658" },
      { name: "COE", students: 4961, color: "#ff8042" },
    ],
  };