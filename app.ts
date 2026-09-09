import fs from "fs";

const urlRoot =
  "https://github.com/angelbcdev/data-analysis-portfolio/tree/main/Projects/";

interface Idata {
  heather: string;
  projects: {
    title: string;
    description: string;
    tools: string;
    link: string;
  }[];
}
const data: Idata[] = [
  {
    heather: "SQL",
    projects: [
      {
        title: "Clean data survey",
        description:
          "This project focuses on cleaning, transforming, and analyzing a customer survey dataset using MySQL.",
        tools: "SQL",
        link: "survey-data-cleaning",
      },
    ],
  },
  // {
  //   heather: "Python ",
  //   projects: [],
  // },
];

const createTable = () => {
  let template = `# Projects \n

  ## Building. Analyzing. Learning.

  > A collection of projects where I apply SQL, Python, Excel, data analysis, and software development to solve real problems.





  `;

  for (const project of data) {
    template += `### ${project.heather} 
  | Project   | Area Analysis   |  Tools | 🔗 Links  |
  | ------------ |---------------| -----|-------|
  ${project.projects.map((p) => `|${p.title} | ${p.description} | ${p.tools} | [Link](${urlRoot + p.link})|`).join("\n")}
   `;
  }
  template += "\n ****";
  fs.writeFileSync("./Projects/README.md", template);
};

createTable();
