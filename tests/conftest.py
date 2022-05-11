import pytest


def pytest_addoption(parser):
    parser.addoption(
        '--ci',
        action='store_true',
        default=False,
        help='run tests in CI environment'
    )


def pytest_configure(config):
    config.addinivalue_line(
        'markers',
        'no_ci: exclude test from CI'
    )


def pytest_collection_modifyitems(config, items):
    if config.getoption('--ci'):
        skip_no_ci = pytest.mark.skip(
            reason='not run with --ci option')
        for item in items:
            if 'no_ci' in item.keywords:
                item.add_marker(skip_no_ci)