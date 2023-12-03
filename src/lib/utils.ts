export async function npmInstall(...packages: string[]) {
  await exec.exec('npm', ['install', ...packages])
}
