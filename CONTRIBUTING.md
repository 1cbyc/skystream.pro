# Contributing to SkyStream.pro

First off, thank you for considering contributing to SkyStream.pro! It's people like you that make open source such a great community. We welcome any and all contributions, from identifying bugs to implementing new features.

To ensure a smooth and collaborative process, we have established a few guidelines that we ask you to follow.

## Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

There are many ways to contribute to the project, and we appreciate all of them.

### Reporting Bugs

If you encounter a bug, please help us by submitting a detailed report. Before submitting, please check the existing issues to see if someone has already reported it.

When submitting a bug report, please use the "Bug Report" template and include:
*   A clear and descriptive title.
*   A step-by-step description of how to reproduce the bug.
*   The expected behavior and what actually happened.
*   Your operating system, browser, and any other relevant environment details.

### Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one, we'd love to hear it. Please use the "Feature Request" template to submit your idea, including:
*   A clear description of the proposed enhancement.
*   The problem it solves or the value it adds.
*   Any potential alternatives you've considered.

### Submitting Pull Requests

If you're ready to contribute code, that's fantastic! Here’s how to get started.

## Development Workflow

### Local Setup

Please follow the instructions in the main `README.md` to set up your local development environment using Docker.

### Branching Model

Our repository uses a branching model based on GitFlow.
*   `main`: This branch contains the latest stable, production-ready code. Direct pushes are not allowed.
*   `develop`: This is our primary development branch. It contains the latest development changes for the next release. All feature branches are merged into `develop`.
*   **Feature Branches**: All new features and bug fixes should be developed on separate feature branches. These branches should be named descriptively, like `feat/apod-mood-visualizer` or `fix/user-login-bug`.

### Making Changes

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** to your local machine.
3.  **Create a feature branch** from the `develop` branch:
    ```sh
    git checkout develop
    git pull origin develop
    git checkout -b your-branch-name
    ```
4.  **Make your changes** in the new branch.
5.  **Commit your changes** using the Conventional Commits format (see below).
6.  **Push your branch** to your fork on GitHub:
    ```sh
    git push -u origin your-branch-name
    ```
7.  **Open a Pull Request** (PR) from your feature branch to the `develop` branch of the main SkyStream.pro repository.

### Commit Message Format

We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for our commit messages. This helps us automate changelogs and makes the project history easier to read.

Each commit message should be in the format:
`<type>(<scope>): <description>`

*   **type**: `feat`, `fix`, `build`, `chore`, `ci`, `docs`, `perf`, `refactor`, `revert`, `style`, `test`.
*   **scope** (optional): The part of the project your commit affects (e.g., `api`, `frontend`, `mood`, `impact`).
*   **description**: A concise summary of the changes.

**Example Commits:**
```
feat(api): add endpoint for today's APOD mood
fix(frontend): correct date picker display on mobile
docs(readme): update setup instructions
chore(deps): upgrade laravel to 10.1.5
```

### Pull Request Process

1.  **Fill out the PR template**: When you open your PR, please provide a clear description of the changes and link any related issues.
2.  **Ensure CI checks pass**: Your PR will trigger our automated test and linting workflows. Please make sure these checks pass. If they fail, push additional commits to your branch to fix them.
3.  **Code Review**: A maintainer will review your PR. They may ask for changes or improvements. We aim to be constructive and helpful in our feedback.
4.  **Merge**: Once your PR is approved and all checks pass, a maintainer will merge it into the `develop` branch.

Thank you again for your contribution. SkyStream.pro is better because of you!