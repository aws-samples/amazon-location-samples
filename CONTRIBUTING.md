# Contributing Guidelines

Thank you for your interest in contributing to our project. Whether it's a bug report, new
feature, correction, or additional documentation, we greatly value feedback and contributions
from our community.

Please read through this document before submitting any issues or pull requests to ensure we have
all the necessary information to effectively respond to your bug report or contribution.

## Reporting Bugs/Feature Requests

We welcome you to use the GitHub issue tracker to report bugs or suggest features.

When filing an issue, please check existing open, or recently closed, issues to make sure
somebody else hasn't already reported the issue. Please try to include as much information as you
can. Details like these are incredibly useful:

* A reproducible test case or series of steps
* The version of our code being used
* Any modifications you've made relevant to the bug
* Anything unusual about your environment or deployment

## Contributing via Pull Requests

Contributions via pull requests are much appreciated. Before sending us a pull request, please
ensure that:

1. You are working against the latest source on the *main* branch.
2. You check existing open, and recently merged, pull requests to make sure someone else hasn't
   addressed the problem already.
3. You open an issue to discuss any significant work - we would hate for your time to be wasted.

To send us a pull request, please:

1. Fork the repository.
2. Modify the source; please focus on the specific change you are contributing. If you also
   reformat all the code, it will be hard for us to focus on your change.
3. Ensure local tests pass.
4. Commit to your fork using clear commit messages.
5. Send us a pull request, answering any default questions in the pull request interface.
6. Pay attention to any automated CI failures reported in the pull request, and stay involved in
   the conversation.

GitHub provides additional document on [forking a
repository](https://help.github.com/articles/fork-a-repo/) and [creating a pull
request](https://help.github.com/articles/creating-a-pull-request/).

## Finding contributions to work on

Looking at the existing issues is a great way to find something to contribute on. As our
projects, by default, use the default GitHub issue labels (enhancement/bug/duplicate/help
wanted/invalid/question/wontfix), looking at any 'help wanted' issues is a great place to start.

## Setting up a new sample

> **Note**
> The information below apply only to samples that use Node.js (i.e. Web apps, etc.). All other
> samples can simply create a new folder and add the sample files.

Each folder in this repository is a separate sample, however all samples share the same
`package.json` and `package-lock.json` files. This is known as a [monorepo](https://en.wikipedia.org/wiki/Monorepo)
 and it's done via [npm workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces?v=true).

To create a new sample, you need to:
- Create an empty new folder in the root of the repository (e.g. `my-sample`)
- Run `npm init -w my-sample` to initialize the new sample (replace `my-sample` with the name of
  the folder you created)
- Add the sample files to the new folder

Whenever you want to install a new dependency, you need to run `npm install <package-name> -w my-sample` (replace `my-sample` with the name of the folder you created). When adding new dependencies, please try to align version numbers with similar dependencies in other samples.

> **Warning**
> Do not run `npm install` directly in the sample folder. This will install the dependency in the
> sample folder, but not in the root folder, which will cause issues with the monorepo.

The resulting sample should not have any `package-lock.json` and the main `package.json` at the root of
the repository should now have the name of the new sample in the `workspaces` section.

## Code of Conduct

This project has adopted the [Amazon Open Source Code of
Conduct](https://aws.github.io/code-of-conduct). For more information see the [Code of Conduct
FAQ](https://aws.github.io/code-of-conduct-faq) or contact opensource-codeofconduct@amazon.com
with any additional questions or comments.

## Security issue notifications

If you discover a potential security issue in this project we ask that you notify AWS/Amazon
Security via our [vulnerability reporting
page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public
github issue.

## Licensing

See the [LICENSE](LICENSE) file for our project's licensing. We will ask you to confirm the
licensing of your contribution.
