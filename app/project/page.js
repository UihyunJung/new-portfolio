import projectData from "../utils/ProjectData";

export default function Project() {
	return (
		<ul>
			{projectData.map((project) => (
				<li key={project.id}>
					{project.name}
					{project.date}
					<img src={`/img/project/${project.id}.jpg`} alt={project.name} />
				</li>
			))}
		</ul>
	);
}
