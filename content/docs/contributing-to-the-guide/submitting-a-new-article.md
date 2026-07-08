---
title: "Submitting a New Article"
---

# Submitting a New Article

This guide walks you through creating a new documentation page, adding it to the site menu, and previewing it locally before you open a pull request.

It assumes you are contributing through a fork of the repository and that you want to review the article in a local Hugo server before submitting it.

All documentation changes should be made on the `dev` branch, not on `main` or `master`.

## What to Edit, Where?

Documentation pages live in the `content/docs` folder. Each category on the site maps to a folder in `content/docs`, and each page is a `.md` file inside that hierarchy.

Article images and videos live in `assets/media/docs`. Their folder structure mirrors the article hierarchy so it stays easy to find assets for each page.

The left-hand menu is controlled by `data/docs.yaml`.

## Creating a New Article

When you want to add a completely new page, follow this basic structure:

1. Choose the section where the page belongs, such as `content/docs/contributing-to-the-guide` or another existing documentation category.
2. Create a new `.md` file with the article title in the front matter and as the top-level heading.
3. Create a matching media folder under `assets/media/docs` if the article needs images or videos.
4. Add the page to `data/docs.yaml` so it appears in the left-hand menu.

The markdown file should start with front matter and a top-level heading:

```md
---
title: "My New Article"
---

# My New Article
```

For assets, use the same hierarchy as the article itself. For example, an article at `content/docs/contributing-to-the-guide/my-new-article.md` would normally store its images and videos in:

```text
assets/media/docs/contributing-to-the-guide/my-new-article/
```

## Adding a Menu Item

If the article should appear in the sidebar, add a new entry to `data/docs.yaml` in the section that matches the article category.

For example, if you create `content/docs/contributing-to-the-guide/your-new-article-here.md`, add a matching item under `Contributing to the Guide` like this:

```yaml
- title: "Contributing to the Guide"
  items:
    - title: "Overview"
      url: "/docs/contributing-to-the-guide/overview"
    - title: "Submitting a Simple Edit"
      url: "/docs/contributing-to-the-guide/submitting-a-simple-edit"
    - title: "Submitting a New Article"
      url: "/docs/contributing-to-the-guide/submitting-a-new-article"
    - title: "Guidelines"
      url: "/docs/contributing-to-the-guide/guidelines"
    - title: "Your New Article Here"
      url: "/docs/contributing-to-the-guide/your-new-article-here"
```

The `title` is the text shown in the sidebar, and the `url` must match the article slug you chose for the `.md` file. If the article needs images or videos, create a matching folder under `assets/media/docs/contributing-to-the-guide/your-new-article-here/`.

If you are adding a brand-new top-level section, add a new block with a `title` and `items` list. If you are adding a page to an existing section, just insert a new item in the right place.

## Working Locally

This guide covers everything using Visual Studio Code and Git for a fast and efficient workflow.

We are going to fork the repository, clone that fork locally, edit the files, and then open a pull request for review.

You will need [Visual Studio Code](https://code.visualstudio.com/), [Hugo](https://gohugo.io/installation/), and [Git](https://git-scm.com/downloads) installed. You will also need to be signed into GitHub from Git. If you have not done that yet, [please follow the steps to set up Git.](https://docs.github.com/en/get-started/getting-started-with-git/set-up-git)

## Forking the Repository

First things first, we will need to fork the repository.
You do this using the fork button on the [GitHub repository](https://github.com/VRMADA/ultimatexr.io).
![](/media/docs/contributing-to-the-guide/submitting-a-new-article/01ForkButton.png)

On the fork page, choose the account that should own the fork. If you want the fork to include every branch, leave `Copy the DEFAULT branch only` unchecked, then click `Create fork`.

GitHub will then redirect you to the new `ultimatexr.io` repository on your own profile.

From here you can make changes to the documentation. You could do this through GitHub, but it is far more convenient to have a folder on your computer where you can make local changes and push those to your repository.

## Cloning the Forked Repository

Next up, we are going to clone the repository we have just created.
We will do this using Git and the command line.

First things first, open your Command Prompt, PowerShell, or Terminal and navigate to the location where you want to clone the repository.

For Windows, you can do this by copying the link to the folder in File Explorer, typing `cd ` in your command line, and then pasting the path there.
It would look something like this:
![](/media/docs/contributing-to-the-guide/submitting-a-new-article/02CmdCd.png)

From there, we need to clone the repository.

To do this, use the following command:

```bash
git clone https://github.com/YOUR-USERNAME/ultimatexr.io.git
```

If you copied all branches when you created the fork, switch to the `dev` branch after cloning. That is the branch you should use for documentation changes:

```bash
git switch dev
```

## Setting Up the Hugo Framework

To see your changes directly, you can run Hugo in server mode.

This will watch the folder for changes. That means whenever you change the site content, it will show up quickly in the browser. Media changes may still require a manual refresh depending on the file type and browser caching.

To do this, navigate to the `ultimatexr.io` folder using `cd ` and then run:

```bash
hugo server
```

After it finishes compiling, you will see the pages it has rendered and, more importantly, the URL where you can view the compiled website.
Your terminal should look something like this:

![](/media/docs/contributing-to-the-guide/submitting-a-new-article/03CmdHugoServer.png)

The bottom part shows the web server address.
In this example it is `http://localhost:1313/`, which is the default Hugo server address.

In Windows Terminal or Command Prompt, you can `CTRL + Click` the link to open it in your browser. Alternatively, you can copy it by selecting it and pressing `CTRL + C`.

Once you have done that, you should be greeted with the UltimateXR website, which means you have successfully compiled the website and are running the server.

Any time you modify the source files, Hugo will rebuild the site automatically and the console should show a message similar to `Change detected, rebuilding site (#0)`.

Closing the terminal window will stop the server too.

## Using Visual Studio Code

Visual Studio Code has built-in Git features that make it easy to review and commit your changes.

Open the `ultimatexr.io` folder in VS Code and start making the necessary changes.

On the left bar, which has all the icons in it, you can find the Git icon.
It looks like this:

![](/media/docs/contributing-to-the-guide/submitting-a-new-article/04SourceControl.png)

You can also press `CTRL + SHIFT + G`, which opens this menu too.

You will see all the files you have changed. From there you can commit your changes directly to your fork.

Communication is key in an open-source project, so we recommend clear and concise commit messages. If you are fixing an issue, include the keyword `fix`, `fixed`, or `fixes` plus the issue number.

You can find the issue number on the GitHub issues page, as shown below:

![](/media/docs/contributing-to-the-guide/submitting-a-new-article/05GitHubIssueNo.png)

In this case it is `#4`, so the commit should contain `fixed #4`.

### Separating Commits

One of the keys to properly communicating your changes is staging commits separately. Staged files are ready to be committed to the repository.

You can stage a change by clicking the plus button, which adds it to the staged changes, as shown below:

![](/media/docs/contributing-to-the-guide/submitting-a-new-article/06StageChanges.png)

When you have staged the proper changes, click the `Commit` button to create the commit. When you are ready to publish your branch, press `Sync Changes`, which will publish it to GitHub.

That concludes the guide for creating and previewing a new article.
We appreciate your efforts in contributing to UltimateXR!
