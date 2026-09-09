import fs from "fs";
const urlRoot = "https://github.com/angelbcdev/data-analysis-portfolio/tree/main/Projects/";
const data = [
    {
        heather: "SQL",
        projects: [
            {
                title: "Clean data survey",
                description: "This project focuses on cleaning, transforming, and analyzing a customer survey dataset using MySQL.",
                tools: "SQL",
                link: "survey-data-cleaning",
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
