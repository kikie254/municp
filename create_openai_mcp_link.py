import json
from urllib.parse import quote

def create_kiro_install_link(name: str, config: dict) -> str:
    """
    Creates a Kiro install link for one-click MCP server installation
    
    Args:
        name: Display name for the MCP server
        config: MCP server configuration dictionary
        
    Returns:
        Formatted HTTPS install link URL
    """
    encoded_name = quote(name)
    encoded_config = quote(json.dumps(config))
    return f"https://kiro.dev/launch/mcp/add?name={encoded_name}&config={encoded_config}"

# OpenAI MCP Server configuration
openai_config = {
    'command': 'uvx',
    'args': ['openai-compatible-mcp'],
    'env': {
        'OPENAI_API_KEY': 'your-api-key-here',
        'OPENAI_API_BASE': 'https://api.openai.com/v1',
        'OPENAI_API_MODEL': 'gpt-4o-mini'
    },
    'disabled': False,
    'autoApprove': []
}

# Generate the install link
link = create_kiro_install_link('OpenAI', openai_config)
print("OpenAI MCP Server Install Link:")
print(link)
print("\nNote: Replace 'your-api-key-here' with your actual OpenAI API key after installation")
