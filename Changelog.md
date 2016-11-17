# 0.4.0 - 2016-11-16

- Consume new Mateo source maps. Adds support for [Hercule]()-style
  transclusion when using API Blueprint.
- Ensure tags with no name get ignored. These are artifacts of the input
  serialization format (API Elements, currently).

# 0.3.0 - 2016-11-12

- Add tests for remaining rules and get better coverage for a few cases,
  such as URI template capitalization for actions which override the URI.
- Fix a bug in the URI template capitalization rule where the current and
  expected values where incorrectly compared, causing erroneous issues to be
  returned.

# 0.2.0 - 2016-11-10

- Add test coverage for most rules.
- Fixed a couple minor issues with rule edge cases.

# 0.1.0 - 2016-11-05

- Initial release.
