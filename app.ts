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
    heather: "Angel",
    projects: [
      {
        title: "this is a title",
        description: "this is a description",
        tools: "TS ,NODEJS ,REACT ",
        link: "Audits",
      },
      {
        title: "this is a title w",
        description: "this is a description",
        tools: "TS ,NODEJS ,REACT ",
        link: "404",
      },
      {
        title: "this is a title w",
        description: "this is a description",
        tools: "TS ,NODEJS ,REACT ",
        link: "no",
      },
    ],
  },
  {
    heather: "second ",
    projects: [
      {
        title: "this is a title",
        description: "this is a description",
        tools: "TS ,NODEJS ,REACT ",
        link: "d",
      },
      {
        title: "this is a title w",
        description: "this is a description",
        tools: "TS ,NODEJS ,REACT ",
        link: "s",
      },
    ],
  },
];

const createTable = () => {
  let template = `# Projects \n`;

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
